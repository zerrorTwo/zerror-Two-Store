import crypto from "crypto";
import jwt from "jsonwebtoken";
import asyncHandeler from "../middlewares/async.handler.js";
import { HEADER, COOKIE } from "../constants/header.constants.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import { findKeyByUserId } from "../repositories/key.token.repository.js";
const generateRSAKeyPair = () =>
  crypto.generateKeyPairSync("rsa", {
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

const generateToken = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
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

const authenticationRefresh = asyncHandeler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Not found userId");
  }

  const keyStore = await findKeyByUserId(userId);

  if (!keyStore) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Not found keyStore");
  }

  try {
    const refreshToken = req.cookies[COOKIE.JWT];
    const decodedUser = jwt.verify(refreshToken, keyStore.publicKey);

    if (decodedUser.id !== userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    req.id = keyStore._id;
    req.userId = keyStore.user;
    return next();
  } catch (error) {
    throw error;
  }
});

const authentication = asyncHandeler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Not found userId");
  }

  const keyStore = await findKeyByUserId(userId);

  if (!keyStore) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Not found keyStore");
  }

  const bearerAccessToken = req.headers[HEADER.AUTHORIZATION];
  const accessToken = bearerAccessToken?.split(" ")[1];

  if (!accessToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
  }

  try {
    // Synchronously verify access token
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey);

    if (userId !== decodedUser.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token does not match");
    }
    if (!decodedUser.isAdmin) {
      if (req.query?.userId && req.query.userId !== userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Not authenticated");
      }
      if (req.params?.userId && req.params.userId !== userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Not authenticated");
      }
    }

    const refreshToken = req.cookies[COOKIE.JWT];
    req.id = keyStore._id;
    req.user = keyStore.user;
    req.refreshToken = refreshToken;
    req.publicKey = keyStore.publicKey;

    return next(); // Proceed to the next middleware
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    throw error;
  }
});

const authorization = asyncHandeler(async (req, res, next) => {
  try {
    const bearerAccessToken = req.headers[HEADER.AUTHORIZATION];
    const accessToken = bearerAccessToken?.split(" ")[1];
    const publicKey = req.publicKey;

    const decodedUser = jwt.verify(accessToken, publicKey);

    if (decodedUser.isAdmin) {
      return next();
    } else {
      throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
    }
  } catch (error) {
    next(error);
  }
});

export {
  generateToken,
  generateRSAKeyPair,
  authentication,
  authorization,
  authenticationRefresh,
};
