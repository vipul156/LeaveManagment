import jwt from "jsonwebtoken"
import User from "../models/User.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Only admin can create managers, default to employee
    const userRole = role === "manager" ? "employee" : role || "employee"

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      department,
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      leaveBalance: user.leaveBalance,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Your account has been disabled" })
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      leaveBalance: user.leaveBalance,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
