import ApiError from "../utils/ApiError.js";
import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { keyTokenService, removeKeyById } from "./keyTokenService.js";
import { generateToken } from "../auth/authUtil.js";
import bcrypt from "bcryptjs";

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

    const tokens = await generateToken(
      { id: newUser._id, email: newUser.email },
      privateKey,
      publicKey
    );

    const saveKey = await keyTokenService({
      userId: newUser._id,
      publicKey: publicKeyString,
      refreshToken: tokens.refreshToken.toString(),
    });

    console.log(tokens);

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
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

const signIn = async ({ email, password }) => {
  //  1.Check email
  //  2.Check password
  //  3. Generate PK and PK
  //  4. Generate tokens
  //  5. Get data
  try {
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

    const tokens = await generateToken(
      { id: user._id, email: user.email },
      privateKey,
      publicKey
    );

    await keyTokenService({
      refreshToken: tokens.refreshToken,
      publicKey,
      userId: user._id,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  } catch (error) {
    return error;
  }
};

const logout = async ({ keyStore }) => {
  const delKey = await removeKeyById(keyStore._id);
  return delKey;
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

export { signUp, signIn, logout, findByEmail };
