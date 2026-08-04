import express from "express";
import { isAuthenticated } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createCompany,
  getMyCompanies,
  getCompanyById,
  updateCompany
} from "../controllers/companyController.js";

const router  = express.Router()

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("recruiter"),
  upload.single("logo"),
  createCompany
);

router.get(
  "/my",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getMyCompanies
);

router.get(
  "/:id",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getCompanyById
);

router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("recruiter"),
  upload.single("logo"),
  updateCompany
);

export default router;