import ApiError from "../utils/ApiError.js";
import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import {
  findById,
  findByUserId,
  keyTokenService,
  removeKeyById,
} from "./keyTokenService.js";
import { HEADER } from "../constants/headerContans.js";
import { generateToken } from "../auth/authUtil.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bcryptPassword from "../utils/bcryptPassword.js";
import { COOKIE } from "../constants/headerContans.js";

const signUp = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "All fields are required");
  }

  const hasPassword = await bcryptPassword(password);

  // Create and save the new user
  const newUser = new User({ userName, email, password: hasPassword });
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    await newUser.save();

    const publicKeyString = publicKey.toString();
    const privateKeyString = privateKey.toString();

    const tokens = await generateToken(
      { id: newUser._id, email: newUser.email },
      privateKey,
      publicKey
    );

    const saveKey = await keyTokenService({
      userId: newUser._id,
      privateKey: privateKeyString,
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

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    // console.log(publicKey, privateKey);

    const tokens = await generateToken(
      { id: user._id, email: user.email },
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
      privateKey,
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
    const { keyStore, refreshToken } = req;

    // Remove refresh token from the database
    const delKey = await removeKeyById({ id: keyStore._id, refreshToken });

    // Clear the refresh token cookie
    res.clearCookie(COOKIE.JWT, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return delKey;
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to log out" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies[COOKIE.JWT];
    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found refresh token");
    }
    const user_client = req.headers[HEADER.CLIENT_ID];
    const keyStore = await findByUserId(user_client);
    if (!keyStore) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found user_client");
    }
    if (!keyStore.refreshToken === refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const decoded = jwt.verify(refreshToken, keyStore.publicKey);

    if (decoded.id !== user_client) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token does not match");
    }

    const privateKey = keyStore.privateKey;
    const publicKey = keyStore.publicKey;

    const publicKeyString = publicKey.toString();
    const privateKeyString = privateKey.toString();

    const tokens = await generateToken(
      { id: decoded.id, email: decoded.email },
      privateKey,
      publicKey
    );

    const saveKey = await keyTokenService({
      userId: keyStore.user,
      privateKey: privateKeyString,
      publicKey: publicKeyString,
      refreshToken: tokens.refreshToken.toString(),
    });

    if (saveKey) {
      res.cookie(COOKIE.JWT, tokens.refreshToken.toString(), {
        httpOnly: true,
        sercure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return tokens.accessToken.toString();
    }
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
  return await User.findOne({ email: email }).select(select).lean();
};

const findRoleByUserId = async (userId) => {
  return await User.findOne({ _id: userId }).select("-password").lean();
};

export { signUp, signIn, logout, refreshToken, findByEmail, findRoleByUserId };
