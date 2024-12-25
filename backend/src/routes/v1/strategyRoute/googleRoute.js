import express from "express";
import passport from "passport";
const router = express.Router();

// Route đăng nhập bằng Google
router.route("/google/login").get(
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// Callback sau khi người dùng đăng nhập với Google
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "/", // Chuyển hướng về trang chủ nếu đăng nhập thất bại
  }),
  (req, res) => {
    // Sau khi đăng nhập thành công, user sẽ được lưu trong `req.user`
    const profile = req.user; // Lấy thông tin người dùng từ session của Passport
    res.json(profile); // Gửi thông tin người dùng dưới dạng JSON
  }
);

export const googleAuth = router;
