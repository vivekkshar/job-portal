import express from "express"
import { register, login, getme, logout } from "../controllers/authcontroller.js"
import { isAuthenticated } from "../middleware/authmiddleware.js"
import  upload  from "../middleware/uploadMiddleware.js";
import { updateProfile } from "../controllers/authController.js";
import { registerValidation} from "../validators/authValidator.js";
import validate from "../middleware/validate.js";




const router = express.Router()

router.post("/register", registerValidation, validate, register)
router.post("/login", login)
router.get("/me", isAuthenticated, getme)
router.get("/logout", isAuthenticated, logout)

router.put(
  "/profile/update",
  isAuthenticated,
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  updateProfile
);



export default router