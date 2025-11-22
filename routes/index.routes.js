import { Router } from "express";
import userAuthRoutes from "./user/auth.routes.js"

const router = Router()

router.use("/user/auth",userAuthRoutes )

export default router