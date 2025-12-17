import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "./models/User.js"
import LeavePolicy from "./models/LeavePolicy.js"

dotenv.config()

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await LeavePolicy.deleteMany({})

    // Create admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@company.com",
      password: "admin123",
      role: "admin",
      department: "Administration",
      leaveBalance: 30,
    })

    // Create manager
    const manager = await User.create({
      name: "John Manager",
      email: "manager@company.com",
      password: "manager123",
      role: "manager",
      department: "Engineering",
      leaveBalance: 25,
    })

    // Create employees
    await User.create({
      name: "Jane Employee",
      email: "employee@company.com",
      password: "employee123",
      role: "employee",
      department: "Engineering",
      leaveBalance: 20,
      manager: manager._id,
    })

    await User.create({
      name: "Bob Developer",
      email: "bob@company.com",
      password: "employee123",
      role: "employee",
      department: "Engineering",
      leaveBalance: 18,
      manager: manager._id,
    })

    // Create leave policies
    await LeavePolicy.create([
      {
        name: "Annual Leave",
        description: "Standard paid annual leave for all employees",
        maxDaysPerYear: 20,
        carryForward: true,
        isActive: true,
      },
      {
        name: "Sick Leave",
        description: "Paid sick leave for medical reasons",
        maxDaysPerYear: 10,
        carryForward: false,
        isActive: true,
      },
      {
        name: "Personal Leave",
        description: "Leave for personal matters",
        maxDaysPerYear: 5,
        carryForward: false,
        isActive: true,
      },
      {
        name: "Maternity Leave",
        description: "Paid maternity leave for new mothers",
        maxDaysPerYear: 90,
        carryForward: false,
        isActive: true,
      },
      {
        name: "Paternity Leave",
        description: "Paid paternity leave for new fathers",
        maxDaysPerYear: 14,
        carryForward: false,
        isActive: true,
      },
    ])

    console.log("Database seeded successfully!")
    console.log("\nTest Credentials:")
    console.log("Admin: admin@company.com / admin123")
    console.log("Manager: manager@company.com / manager123")
    console.log("Employee: employee@company.com / employee123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
