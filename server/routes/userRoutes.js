import express from "express"
import {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  toggleUserStatus,
  getManagers,
} from "../controllers/userController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

router.get("/managers", protect, getManagers)
router.get("/", protect, authorize("admin"), getAllUsers)
router.post("/", protect, authorize("admin"), createUser)
router.get("/:id", protect, authorize("admin"), getUser)
router.put("/:id", protect, authorize("admin"), updateUser)
router.patch("/:id/toggle-status", protect, authorize("admin"), toggleUserStatus)

export default router
