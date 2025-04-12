import express from "express";
import passport from "passport";
import { signInGGController } from "../../../controllers/access.controller.js";
const router = express.Router();

router.route("/google/login").get((req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    process.env.GOOGLE_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    "http://localhost:5000/v1/api/auth/google/callback" // Đảm bảo URL này khớp với cấu hình Google
  )}&response_type=code&scope=profile%20email`;
  res.redirect(authUrl);
});

// Callback sau khi người dùng đăng nhập với Google
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Failtologin`,
    session: false,
  }),
  signInGGController
);

export const googleAuth = router;
