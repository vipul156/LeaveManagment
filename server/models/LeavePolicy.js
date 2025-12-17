import mongoose from "mongoose"

const leavePolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Policy name is required"],
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    maxDaysPerYear: {
      type: Number,
      required: [true, "Maximum days per year is required"],
      min: 0,
    },
    carryForward: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const LeavePolicy = mongoose.model("LeavePolicy", leavePolicySchema)
export default LeavePolicy
