import express from "express";
import passport from "passport";
import { signInGGController } from "../../../controllers/access.controller.js";

const router = express.Router();

// Route khởi tạo đăng nhập Google (Passport tự tạo URL)
router.get("/google/login", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: true,
}));

// Route callback sau khi xác thực thành công
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Failtologin`,
    session: true,
  }),
  signInGGController // Đăng nhập thành công
);

export const googleAuth = router;
