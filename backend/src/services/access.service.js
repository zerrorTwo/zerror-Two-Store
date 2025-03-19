import UserModel from "../models/user.model.js";
import { keyTokenService } from "./key.token.service.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import { HEADER } from "../constants/header.constants.js";
import { generateRSAKeyPair, generateToken } from "../auth/auth.util.js";
import bcrypt from "bcryptjs";
import bcryptPassword from "../utils/bcrypt.password.js";
import { COOKIE } from "../constants/header.constants.js";
import {
  findByEmail,
  findRoleByUserId,
  findUserById,
  findKeyStoreById,
} from "../repositories/access.repository.js";

const signUp = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "All fields are required");
  }

  if (password.length < 8) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password must be at least 8 characters"
    );
  }

  const hasPassword = await bcryptPassword(password);

  // Create and save the new user
  const newUser = new UserModel({ userName, email, password: hasPassword });
  try {
    const { publicKey, privateKey } = generateRSAKeyPair();

    await newUser.save();

    const publicKeyString = publicKey.toString();

    const tokens = await generateToken(
      { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      privateKey,
      publicKey
    );

    await keyTokenService({
      userId: newUser._id,
      publicKey: publicKeyString,
      refreshToken: tokens.refreshToken.toString(),
    });

    // console.log(tokens);
    res.cookie(COOKIE.JWT, tokens.refreshToken.toString(), {
      httpOnly: true,
      sercure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken.toString(),
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    }
    if (error.name === "ValidationError") {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message);
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "An error occurred while creating the user"
    );
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findByEmail({ email });

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
      sercure: true,
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
      sercure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // console.log(tokens);

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

export { signUp, signIn, signInByGG, logout, refreshToken, findRoleByUserId };
