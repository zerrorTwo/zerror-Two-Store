import ApiError from "../utils/ApiError.js";
import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import bcryptPassword from "../utils/bcryptPassword.js";
import crypto from "crypto";
import { keyTokenService } from "../services/keyTokenService.js";
import { generateToken } from "../auth/authUtil.js";

const createNew = async (req, res) => {
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

    const saveKey = await keyTokenService({
      userId: newUser._id,
      publicKey: publicKeyString,
    });

    const tokens = await generateToken(
      { id: newUser._id, email: newUser.email },
      privateKey,
      publicKey
    );
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

export { createNew };
