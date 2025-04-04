import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import { userRepository } from "../repositories/user.repository.js";
import generateConfirmationCode from "../utils/generate.confirm.code.js";

const sendVerificationEmail = async (gmail) => {
  try {
    const code = generateConfirmationCode();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: gmail,
      subject: "Xác nhận tài khoản",
      html: `<p>Mã xác nhận của bạn là: <b>${code}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
    return code;
  } catch (error) {
    throw error;
  }
};

const verify_gmail = async (gmail, code) => {
  try {
    const user = await userRepository.findByUserEmail(gmail);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (user?.code !== code) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verification code");
    }
    if (!user.code || !user.codeExpiry) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid verification code");
    }
    const isCodeExpired = new Date() > user.codeExpiry;
    if (isCodeExpired) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Code has expired");
    }
    user.isVerified = true;
    user.code = null;
    user.codeExpiry = null;
    await user.save();
    return { success: true, message: "Verified successfully" };
  } catch (error) {
    throw error;
  }
};

export const mailService = { sendVerificationEmail, verify_gmail };
