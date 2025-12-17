import LeaveRequest from "../models/LeaveRequest.js"
import User from "../models/User.js"

export const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body

    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysRequested = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

    if (daysRequested <= 0) {
      return res.status(400).json({ message: "Invalid date range" })
    }

    if (req.user.leaveBalance < daysRequested) {
      return res.status(400).json({ message: "Insufficient leave balance" })
    }

    const leaveRequest = await LeaveRequest.create({
      user: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      daysRequested,
    })

    res.status(201).json(leaveRequest)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user._id })
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })
    res.json(leaves)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate("user", "name email role department")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })
    res.json(leaves)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getTeamLeaves = async (req, res) => {
  try {
    // Get employees who have this manager assigned
    const employees = await User.find({ manager: req.user._id, role: "employee" })
    const employeeIds = employees.map((emp) => emp._id)

    const leaves = await LeaveRequest.find({ user: { $in: employeeIds } })
      .populate("user", "name email department")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })

    res.json(leaves)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body
    const leave = await LeaveRequest.findById(req.params.id).populate("user")

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave request has already been processed" })
    }

    // Check authorization
    const requestingUser = leave.user

    if (req.user.role === "manager") {
      // Manager can only approve employee leaves (not managers or admins)
      if (requestingUser.role !== "employee") {
        return res.status(403).json({ message: "Managers can only approve employee leave requests" })
      }
      // Check if this employee reports to this manager
      if (String(requestingUser.manager) !== String(req.user._id)) {
        return res.status(403).json({ message: "You can only manage your team members' leaves" })
      }
    }

    // Admin can approve all leaves

    leave.status = status
    leave.remarks = remarks || ""
    leave.approvedBy = req.user._id

    // If approved, decrement leave balance
    if (status === "approved") {
      const user = await User.findById(leave.user._id)
      user.leaveBalance = Math.max(0, user.leaveBalance - leave.daysRequested)
      await user.save()
    }

    await leave.save()

    res.json(leave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const cancelLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id)

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" })
    }

    if (String(leave.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to cancel this leave" })
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending leave requests" })
    }

    await LeaveRequest.findByIdAndDelete(req.params.id)
    res.json({ message: "Leave request cancelled successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
