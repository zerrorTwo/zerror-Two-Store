import express from "express";
import {
  signUpController,
  signInController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
} from "../../controllers/access.controller.js";
import { authenticationRefresh } from "../../auth/auth.util.js";
import asyncHandeler from "../../middlewares/async.handler.js";
import { googleAuth } from "./strategyRoute/google.route.js";

const Router = express.Router();

Router.use(googleAuth);

Router.route("/signUp").post(signUpController);
Router.route("/signIn").post(signInController);
Router.route("/forgot-password").post(forgotPasswordController);
Router.route("/reset-password").post(resetPasswordController);
Router.route("/logout").post(asyncHandeler(logoutController));

Router.use(authenticationRefresh);
Router.route("/refresh").post(refreshTokenController);

export const authRoute = Router;
