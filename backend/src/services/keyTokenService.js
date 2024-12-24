import { Types } from "mongoose";
import KeyModel from "../models/keyModel.js";

const keyTokenService = async ({ userId, publicKey, refreshToken }) => {
  try {
    const filter = { user: userId };
    const update = {
      publicKey,
      refreshToken, // Thêm refreshToken vào mảng
    };
    const options = { upsert: true, new: true }; // Nếu không tồn tại, tạo mới

    const token = await KeyModel.findOneAndUpdate(filter, update, options);
    return token;
  } catch (error) {
    // console.error("Error in keyTokenService:", error);
    throw new Error("Failed to save key token");
  }
};

const findByUserId = async (userId) => {
  return await KeyModel.findOne({ user: new Types.ObjectId(userId) }).lean();
};

const findById = async (id) => {
  return await KeyModel.findOne({ _id: new Types.ObjectId(id) }).lean();
};

const removeKeyByUserId = async (userId) => {
  try {
    const key = await KeyModel.findOne({ user: userId });

    if (!key) {
      throw new Error("User not found.");
    }

    await KeyModel.deleteOne({ _id: key._id });
    return { message: "Delete successfully" };
  } catch (error) {
    throw new Error("Failed to remove refresh token");
  }
};

export { keyTokenService, findByUserId, removeKeyByUserId, findById };
