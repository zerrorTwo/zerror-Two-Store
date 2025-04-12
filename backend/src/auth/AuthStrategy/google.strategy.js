import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../models/user.model.js";

const passportMiddleware = (app) => {
  app.use(passport.initialize());

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
            isVerified: true,
          });
        }
        return done(null, user);
      }
    )
  );
};

export default passportMiddleware;
