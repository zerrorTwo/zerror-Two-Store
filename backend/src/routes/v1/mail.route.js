import express from "express";
import {
  sendVerificationEmail,
  verify_email,
} from "../../controllers/mail.controller.js";

const Router = express.Router();

Router.route("/send-verification-email").get(sendVerificationEmail);

Router.route("/verify-email").get(verify_email);

export const mailRoute = Router;
