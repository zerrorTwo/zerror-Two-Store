const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // đổi thành true nếu dùng HTTPS
    maxAge: 5 * 60 * 1000, // 5 phút
    sameSite: "lax",
  },
};

export default sessionOptions;
