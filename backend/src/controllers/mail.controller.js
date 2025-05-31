import { StatusCodes } from "http-status-codes";
import asyncHandler from "../middlewares/async.handler.js";
import { mailService } from "../services/mail.service.js";

const sendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;
  const code = await mailService.sendVerificationEmail(email);
  res.status(StatusCodes.OK).json({ success: true, code });
});

const verify_email = asyncHandler(async (req, res) => {
  const { email, code } = req.query;
  const confirm = await mailService.verify_email(email, code);
  res.status(StatusCodes.OK).json(confirm);
});

export { sendVerificationEmail, verify_email };
