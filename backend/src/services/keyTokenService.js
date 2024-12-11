import Key from "../models/keyModel.js";

const keyTokenService = async ({ userId, publicKey }) => {
  try {
    const token = await Key.create({
      user: userId,
      publicKey: publicKey,
    });

    return token ? publicKey : null;
  } catch (error) {
    console.error("Error in keyTokenService:", error);
    throw new Error("Failed to save key token");
  }
};

export { keyTokenService };
