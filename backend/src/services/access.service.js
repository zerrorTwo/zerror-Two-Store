import UserModel from "../models/user.model.js";
import { keyTokenService, removeKeyByUserId } from "./key.token.service.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import { HEADER } from "../constants/header.constants.js";
import { generateRSAKeyPair, generateToken } from "../auth/auth.util.js";
import bcrypt from "bcryptjs";
import bcryptPassword from "../utils/bcrypt.password.js";
import { COOKIE } from "../constants/header.constants.js";
import { accessRepository } from "../repositories/access.repository.js";
import { mailService } from "./mail.service.js";
import { userRepository } from "../repositories/user.repository.js";

const signUp = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "All fields are required");
  }

  const existsUser = await userRepository.findByUserEmail(email);

  if (existsUser && existsUser?.googleId) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This account was created with Google. Please sign in with Google."
    );
  }

  if (existsUser) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
  }

  if (password.length < 8) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password must be at least 8 characters"
    );
  }

  const hasPassword = await bcryptPassword(password);

  // Create and save the new user
  const newUser = await userRepository.createUser({
    userName,
    email,
    password: hasPassword,
  });
  await mailService.sendVerificationEmail(email);
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return {
    user: userWithoutPassword,
  };
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await accessRepository.findByEmail({ email });

    if (user && user?.googleId) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "This account was created with Google. Please sign in with Google."
      );
    }

    if (user?.isVerified === false) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Email not verified");
    }
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const { publicKey, privateKey } = generateRSAKeyPair();

    const tokens = await generateToken(
      {
        id: user._id,
        email: user?.email,
        isAdmin: user?.isAdmin,
        number: user?.number,
      },
      privateKey,
      publicKey
    );

    res.cookie(COOKIE.JWT, tokens.refreshToken.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await keyTokenService({
      refreshToken: tokens.refreshToken,
      publicKey,
      userId: user._id,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken.toString(),
    };
  } catch (err) {
    throw err;
  }
};

const signInByGG = async (req, res) => {
  try {
    const user = req.user;
    const { publicKey, privateKey } = generateRSAKeyPair();

    const tokens = await generateToken(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      privateKey,
      publicKey
    );

    res.cookie(COOKIE.JWT, tokens.refreshToken.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await keyTokenService({
      refreshToken: tokens.refreshToken,
      publicKey,
      userId: user._id,
    });
    return {
      user: user,
      accessToken: tokens.accessToken.toString(),
    };
  } catch (error) {
    throw error;
  }
};

const logout = async (req, res) => {
  try {
    const id = req.headers[HEADER.CLIENT_ID];

    // Nếu không có client ID, chỉ xóa cookie
    if (!id) {
      res.clearCookie(COOKIE.JWT, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      if (req.cookies && req.cookies["connect.sid"]) {
        res.clearCookie("connect.sid");
      }
      return { message: "Logged out successfully" };
    }

    // Xóa refresh token từ cơ sở dữ liệu
    const delKey = await removeKeyByUserId(id);

    if (!delKey) {
      // Nếu không tìm thấy hoặc xóa key thất bại, vẫn xóa cookie
      res.clearCookie(COOKIE.JWT, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      if (req.cookies && req.cookies["connect.sid"]) {
        res.clearCookie("connect.sid");
      }
      return { message: "Logged out successfully" };
    }

    // Xóa cookie refresh token
    res.clearCookie(COOKIE.JWT, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    if (req.cookies && req.cookies["connect.sid"]) {
      res.clearCookie("connect.sid");
    }

    return { message: "Logged out successfully" };
  } catch (error) {
    console.log(error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to log out");
  }
};

const refreshToken = async (req, res) => {
  try {
    const { id, userId } = req;
    const keyStore = await findKeyStoreById(id);

    if (!keyStore) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid key store");
    }

    const user = await findUserById(userId);

    const { publicKey, privateKey } = generateRSAKeyPair();

    const tokens = await generateToken(
      { id: user._id, email: user.email },
      privateKey,
      publicKey
    );

    const saveKey = await keyTokenService({
      userId: user._id,
      publicKey: publicKey.toString(),
      refreshToken: tokens.refreshToken.toString(),
    });

    if (saveKey) {
      res.cookie(COOKIE.JWT, tokens.refreshToken.toString(), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(StatusCodes.OK).json(tokens.accessToken.toString());
    }

    throw new ApiError(StatusCodes.BAD_REQUEST, "Save key failed");
  } catch (err) {
    throw err;
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userRepository.findByUserEmail(email);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Email not found!!");
  }
  if (user?.isVerified === false) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Email not verified");
  }

  // Gửi email chứa resetCode (giả định có mailService)
  await mailService.sendVerificationEmail(email);
  return {
    success: true,
    message: "A reset email has been sent to your Email",
  };
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await userRepository.findByUserEmail(email);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.code !== code) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid reset code");
  }

  const isCodeExpired = new Date() > user.codeExpiry;
  if (isCodeExpired) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Code has expired");
  }

  const hasPassword = await bcryptPassword(newPassword);
  user.password = hasPassword;
  user.code = null;
  user.codeExpiry = null;
  await userRepository.saveUser(user);

  return {
    success: true,
    message: "Password reset successfully",
  };
};

export {
  signUp,
  signIn,
  signInByGG,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
