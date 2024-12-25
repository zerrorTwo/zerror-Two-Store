import express from "express";
import passport from "passport";
import UserModel from "../../../models/userModel.js";
const router = express.Router();

// Route đăng nhập bằng Google
router.route("/google/login").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback sau khi người dùng đăng nhập với Google
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    // Sau khi đăng nhập thành công, user sẽ được lưu trong `req.user`
    const profile = req.user; // Lấy thông tin người dùng từ session của Passport
    const user = await UserModel.create({
      userName: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
    });
    if (user) res.json(user); // Gửi thông tin người dùng dưới dạng JSON
  }
);

export const googleAuth = router;
