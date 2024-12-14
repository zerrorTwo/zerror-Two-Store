import jwt from "jsonwebtoken";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { HEADER, COOKIE } from "../constants/headerContans.js";
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
      expiresIn: "7 days",
    });

    // Verify access token using the public key
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) throw err;
    });

    return { accessToken, refreshToken };
  } catch (error) {
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

  const bearerAccessToken = req.headers[HEADER.AUTHORIZATION];

  const accessToken = bearerAccessToken.split(" ")[1];

  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
  }
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token does not match");
    }

    const refreshToken = req.cookies[COOKIE.JWT];

    req.keyStore = keyStore;
    req.refreshToken = refreshToken;
    return next();
  } catch (error) {
    throw error;
  }
});

export { generateToken, authentication };
