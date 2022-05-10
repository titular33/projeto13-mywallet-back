import { Router } from "express";
import { login, signUp } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/sign-up", signUp);

export default authRouter;