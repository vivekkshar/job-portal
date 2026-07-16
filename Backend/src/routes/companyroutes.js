import express from "express";
import { isAuthenticated } from "../middleware/authmiddleware.js";
import { authorizeRoles } from "../middleware/rolemiddleware.js";

import {
  createCompany,
  getMyCompanies,
  updateCompany
} from "../controllers/companyController.js";

const router  = express.Router()

router.post(
  "/",
  isAuthenticated,
  authorizeRoles("recruiter"),
  createCompany
);

router.get(
  "/my",
  isAuthenticated,
  authorizeRoles("recruiter"),
  getMyCompanies
);

router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("recruiter"),
  updateCompany
);

export default router;