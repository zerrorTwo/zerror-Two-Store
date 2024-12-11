import jwt from "jsonwebtoken";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { HEADER } from "../constants/headerContans.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { findByUserId } from "../services/keyTokenService.js";
const generateToken = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "30 days",
    });

    // Verify access token using the public key
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) throw err;
      console.log("decode success", decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateToken:", error);
    throw error;
  }
};

const authentication = asyncHandeler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid request");
  }

  const keyStore = await findByUserId(userId);

  if (!keyStore) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Not found keyStore");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
  }
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    console.log(decodeUser.id);

    if (userId !== decodeUser.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token does not match");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

export { generateToken, authentication };
