import express from 'express';
import { applyJob, getMyApplications, getJobApplicants, updateApplicationStatus, } from "../controllers/applicationcontroller.js";
import { isAuthenticated } from '../middleware/authmiddleware.js';
import { authorizeRoles } from '../middleware/rolemiddleware.js';

const router = express.Router();

router.post(
  "/apply/:jobId",
  isAuthenticated,
  authorizeRoles("jobseeker"),
  applyJob
);

router.get(
  "/my-applications",
  isAuthenticated,
  authorizeRoles("jobseeker"),
  getMyApplications
);
router.get(
  "/job/:jobId",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getJobApplicants
);

router.put(
  "/:applicationId/status",
  isAuthenticated,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);



export default router;