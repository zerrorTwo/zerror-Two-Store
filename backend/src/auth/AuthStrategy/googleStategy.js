// middleware/passport.js
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../models/userModel.js";

const passportMiddleware = (app) => {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: true,
      },
    })
  );

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth2 Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/v1/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await UserModel.findOne({ email: email });
        if (!user) {
          user = await UserModel.create({
            email: email,
            googleId: profile.id,
            userName: profile.displayName,
          });
        }
        // Here, you would typically save or process user data from the profile
        return done(null, user);
      }
    )
  );

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passportMiddleware;
