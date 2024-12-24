import ApiError from "../utils/ApiError.js";
import UserModel from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { keyTokenService, removeKeyByUserId } from "./keyTokenService.js";
import { HEADER } from "../constants/headerContans.js";
import { generateRSAKeyPair, generateToken } from "../auth/authUtil.js";
import bcrypt from "bcryptjs";
import bcryptPassword from "../utils/bcryptPassword.js";
import { COOKIE } from "../constants/headerContans.js";
import KeyModel from "../models/keyModel.js";

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
  //  1.Check email
  //  2.Check password
  //  3. Generate PK and PK
  //  4. Generate tokens
  //  5. Get data
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

    // console.log(publicKey, privateKey);

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

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken.toString(),
    };
  } catch (err) {
    throw err;
  }
};

const logout = async (req, res) => {
  try {
    const id = req.headers[HEADER.CLIENT_ID];

    // Xóa refresh token từ cơ sở dữ liệu
    const delKey = await removeKeyByUserId(id);

    if (!delKey) {
      // Nếu không tìm thấy hoặc xóa key thất bại
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to remove refresh token from database"
      );
    }

    // Xóa cookie refresh token
    res.clearCookie(COOKIE.JWT, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Trả về kết quả xóa key thành công
    return delKey;
  } catch (error) {
    // Nếu có lỗi xảy ra trong quá trình logout
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to log out");
  }
};

const refreshToken = async (req, res) => {
  try {
    const { id, userId } = req;
    const keyStore = await KeyModel.findOne({ _id: id });

    if (!keyStore) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid key store");
    }

    const user = await UserModel.findOne({ _id: userId });

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

    // If saveKey fails, respond with an error
    throw new ApiError(StatusCodes.BAD_REQUEST, "Save key failed");
  } catch (err) {
    throw err;
  }
};

const findByEmail = async ({
  email,
  select = {
    userName: 1,
    email: 1,
    password: 1,
    isAdmin: 1,
  },
}) => {
  return await UserModel.findOne({ email: email }).select(select).lean();
};

const findRoleByUserId = async (userId) => {
  return await UserModel.findOne({ _id: userId }).select("-password").lean();
};

export { signUp, signIn, logout, refreshToken, findByEmail, findRoleByUserId };
