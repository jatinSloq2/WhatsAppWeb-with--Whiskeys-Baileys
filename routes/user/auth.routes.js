import { Router } from "express";
import * as userAuthController from "../../controllers/user/auth.controller.js";
const router = Router()

router.post("/login", userAuthController.loginUser)
router.post("/sign-in",userAuthController.registerUser)

export default router