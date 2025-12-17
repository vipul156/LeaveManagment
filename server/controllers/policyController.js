import LeavePolicy from "../models/LeavePolicy.js"

export const getAllPolicies = async (req, res) => {
  try {
    const policies = await LeavePolicy.find().sort({ name: 1 })
    res.json(policies)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getPolicy = async (req, res) => {
  try {
    const policy = await LeavePolicy.findById(req.params.id)
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" })
    }
    res.json(policy)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const createPolicy = async (req, res) => {
  try {
    const { name, description, maxDaysPerYear, carryForward, isActive } = req.body

    const policyExists = await LeavePolicy.findOne({ name })
    if (policyExists) {
      return res.status(400).json({ message: "Policy with this name already exists" })
    }

    const policy = await LeavePolicy.create({
      name,
      description,
      maxDaysPerYear,
      carryForward,
      isActive,
    })

    res.status(201).json(policy)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updatePolicy = async (req, res) => {
  try {
    const { name, description, maxDaysPerYear, carryForward, isActive } = req.body

    const policy = await LeavePolicy.findById(req.params.id)
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" })
    }

    policy.name = name || policy.name
    policy.description = description !== undefined ? description : policy.description
    policy.maxDaysPerYear = maxDaysPerYear !== undefined ? maxDaysPerYear : policy.maxDaysPerYear
    policy.carryForward = carryForward !== undefined ? carryForward : policy.carryForward
    policy.isActive = isActive !== undefined ? isActive : policy.isActive

    const updatedPolicy = await policy.save()
    res.json(updatedPolicy)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deletePolicy = async (req, res) => {
  try {
    const policy = await LeavePolicy.findById(req.params.id)
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" })
    }

    await LeavePolicy.findByIdAndDelete(req.params.id)
    res.json({ message: "Policy deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
