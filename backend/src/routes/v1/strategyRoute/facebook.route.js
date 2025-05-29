import express from "express";
import passport from "passport";
import { signInGGController } from "../../../controllers/access.controller.js";
const router = express.Router();

router.route("/facebook/login").get((req, res) => {
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID
    }&redirect_uri=${encodeURIComponent(
      `${process.env.BACKEND_URL}/v1/api/auth/facebook/callback` // Đảm bảo URL này khớp với cấu hình Facebook

    )}&scope=public_profile,email`; // Các quyền bạn muốn yêu cầu
  res.redirect(authUrl);
});

// Callback sau khi người dùng đăng nhập với Google
router.route("/facebook/callback").get(
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=Failtologin`,
    session: false,
  }),
  signInGGController
);

export const facebookAuth = router;
