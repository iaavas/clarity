import { Router } from "express";
import * as AuthController from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/me", authenticate, AuthController.getCurrentUser);
router.delete("/delete", authenticate, AuthController.deleteAccount);

export default router;
