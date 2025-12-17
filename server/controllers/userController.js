import User from "../models/User.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("manager", "name email")
    res.json(users)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("manager", "name email")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, department, leaveBalance, isActive, manager } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role
    user.department = department || user.department
    user.leaveBalance = leaveBalance !== undefined ? leaveBalance : user.leaveBalance
    user.isActive = isActive !== undefined ? isActive : user.isActive
    user.manager = manager !== undefined ? manager : user.manager

    const updatedUser = await user.save()
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, leaveBalance, manager } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      leaveBalance,
      manager,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      leaveBalance: user.leaveBalance,
      manager: user.manager,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot disable admin account" })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({ message: `User ${user.isActive ? "enabled" : "disabled"} successfully`, user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager", isActive: true }).select("name email department")
    res.json(managers)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
