import express from "express"
import { getAllPolicies, getPolicy, createPolicy, updatePolicy, deletePolicy } from "../controllers/policyController.js"
import { protect, authorize } from "../middleware/auth.js"

const router = express.Router()

router.get("/", protect, getAllPolicies)
router.get("/:id", protect, getPolicy)
router.post("/", protect, authorize("admin"), createPolicy)
router.put("/:id", protect, authorize("admin"), updatePolicy)
router.delete("/:id", protect, authorize("admin"), deletePolicy)

export default router
