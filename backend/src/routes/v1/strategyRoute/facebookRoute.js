import express from "express";
import passport from "passport";
const router = express.Router();

// Route đăng nhập bằng Google
router.route("/facebook/login").get(
  passport.authenticate("facebook", {
    scope: ["profile", "email"],
  })
);

// Callback sau khi người dùng đăng nhập với Google
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  signInGGController
);

export const googleAuth = router;
