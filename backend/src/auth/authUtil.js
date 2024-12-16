import jwt from "jsonwebtoken";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { HEADER, COOKIE } from "../constants/headerContans.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { findByUserId } from "../services/keyTokenService.js";
import { findRoleByUserId } from "../services/accessService.js";
const generateToken = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "3 days",
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
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found userId");
  }

  const keyStore = await findByUserId(userId);

  if (!keyStore) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Not found keyStore");
  }

  const bearerAccessToken = req.headers[HEADER.AUTHORIZATION];
  const accessToken = bearerAccessToken?.split(" ")[1];

  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
  }

  // Handling refresh token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodedUser = jwt.verify(refreshToken, keyStore.publicKey);

      if (decodedUser.id !== userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
      }

      req.id = keyStore._id;
      req.user = keyStore.user;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  try {
    // Synchronously verify access token
    const decodedUser = await new Promise((resolve, reject) => {
      jwt.verify(accessToken, keyStore.publicKey, (err, decoded) => {
        if (err) {
          reject(new ApiError(StatusCodes.UNAUTHORIZED, "Token expired"));
        }
        resolve(decoded);
      });
    });

    if (userId !== decodedUser.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token does not match");
    }

    const refreshToken = req.cookies[COOKIE.JWT];
    req.id = keyStore._id;
    req.user = keyStore.user;
    req.refreshToken = refreshToken;

    return next(); // Proceed to the next middleware
  } catch (error) {
    throw error; // Let the error handler manage the error
  }
});

const authorization = asyncHandeler(async (req, res, next) => {
  try {
    const userId = req.user;
    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid request");
    }

    const user = await findRoleByUserId(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (user.isAdmin) {
      return next();
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
    }
  } catch (error) {
    next(error);
  }
});

export { generateToken, authentication, authorization };
