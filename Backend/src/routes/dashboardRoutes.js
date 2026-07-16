import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import  { getRecruiterDashboard }  from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/recruiter",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getRecruiterDashboard
);

export default router;