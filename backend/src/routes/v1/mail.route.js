import express from "express";
import {
  sendVerificationEmail,
  verify_gmail,
} from "../../controllers/mail.controller.js";

const Router = express.Router();

Router.route("/send-verification-email").post(sendVerificationEmail);

Router.route("/verify-gmail").get(verify_gmail);

export const mailRoute = Router;
