import KeyModel from "../models/keyModel.js";

const keyTokenService = async ({ userId, publicKey, refreshToken }) => {
  try {
    // const token = await Key.create({
    //   user: userId,
    //   publicKey: publicKey,
    //   refreshToken: refreshToken,
    // });

    // return token ? publicKey : null;
    const filter = { user: userId },
      update = {
        publicKey,
        refreshToken,
        refreshTokensUsed: [],
      },
      options = { upsert: true, new: true };
    const token = await KeyModel.findOneAndUpdate(filter, update, options);
  } catch (error) {
    console.error("Error in keyTokenService:", error);
    throw new Error("Failed to save key token");
  }
};

export { keyTokenService };
