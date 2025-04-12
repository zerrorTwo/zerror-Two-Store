import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { userRepository } from "../../repositories/user.repository.js";

const passportMiddleware = (app) => {
  app.use(passport.initialize());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/v1/api/auth/google/callback",
        profileFields: ["id", "displayName", "photos", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await userRepository.findByUserEmail(email);
        if (!user) {
          user = await userRepository.createUser({
            email: email,
            googleId: profile.id,
            authenticationType: "google",
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
