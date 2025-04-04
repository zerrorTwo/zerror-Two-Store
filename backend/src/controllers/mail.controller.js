import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { mailService } from "../services/mail.service.js";

const sendVerificationEmail = asyncHandeler(async (req, res) => {
  const { email } = req.body;
  const code = await mailService.sendVerificationEmail(email);
  res.status(StatusCodes.OK).json(code);
});

const verify_gmail = asyncHandeler(async (req, res) => {
  const { email, code } = req.query;
  const confirm = await mailService.verify_gmail(email, code);
  res.status(StatusCodes.OK).json(confirm);
});

export { sendVerificationEmail, verify_gmail };
