import express from 'express';
import { createJob, getAllJobs, getJobById, updateJob, deleteJob, getMyJobs } from '../controllers/jobcontrollers.js';
import { isAuthenticated } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("recruiter"), createJob);
router.get( "/getjobs",getAllJobs);
router.get("/myjobs", isAuthenticated, authorizeRoles("recruiter"), getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", isAuthenticated, authorizeRoles("recruiter"), updateJob);
router.delete("/:id", isAuthenticated, authorizeRoles("recruiter"), deleteJob);



export default router;