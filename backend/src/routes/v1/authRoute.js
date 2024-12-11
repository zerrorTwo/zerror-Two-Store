import express from "express";
import {
  signUpController,
  signInController,
} from "../../controllers/accessController.js";

const Router = express.Router();

Router.route("/signUp").post(signUpController);
Router.route("/signIn").post(signInController);

export const authRoute = Router;
