import express from "express";
import {
  signUpController,
  signInController,
  logoutController,
  refreshTokenController,
} from "../../controllers/accessController.js";
import { authentication } from "../../auth/authUtil.js";
import asyncHandeler from "../../middlewares/asyncHandler.js";

const Router = express.Router();

Router.route("/signUp").post(signUpController);
Router.route("/signIn").post(signInController);
Router.route("/refresh").post(refreshTokenController);

Router.use(authentication);
Router.route("/logout").post(asyncHandeler(logoutController));

export const authRoute = Router;
