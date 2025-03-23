import { keyTokenRepository } from "../repositories/key.token.repository.js";

const keyTokenService = async ({ userId, publicKey, refreshToken }) => {
  try {
    const token = await keyTokenRepository.createOrUpdateKeyToken({
      userId,
      publicKey,
      refreshToken,
    });
    return token;
  } catch (error) {
    // console.error("Error in keyTokenService:", error);
    throw new Error("Failed to save key token");
  }
};

const findByUserId = async (userId) => {
  return await keyTokenRepository.findKeyByUserId(userId);
};

const findById = async (id) => {
  return await keyTokenRepository.findKeyById(id);
};

const removeKeyByUserId = async (userId) => {
  try {
    return await keyTokenRepository.removeKeyByUserIdRepo(userId);
  } catch (error) {
    throw new Error(`Failed to remove token: ${error.message}`);
  }
};

export { keyTokenService, findByUserId, removeKeyByUserId, findById };
