import express from "express"
import {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaves,
  getTeamLeaves,
  updateLeaveStatus,
  cancelLeave,
} from "../controllers/leaveController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

router.post("/", protect, createLeaveRequest)
router.get("/my", protect, getMyLeaves)
router.get("/all", protect, authorize("admin"), getAllLeaves)
router.get("/team", protect, authorize("manager"), getTeamLeaves)
router.patch("/:id/status", protect, authorize("admin", "manager"), updateLeaveStatus)
router.delete("/:id", protect, cancelLeave)

export default router
