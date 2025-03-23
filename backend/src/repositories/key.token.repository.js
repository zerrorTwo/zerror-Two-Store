import KeyModel from "../models/key.model.js";
import { Types } from "mongoose";

const findKeyByUserId = async (userId) => {
  return await KeyModel.findOne({ user: new Types.ObjectId(userId) }).lean();
};

const findKeyById = async (id) => {
  return await KeyModel.findOne({ _id: new Types.ObjectId(id) }).lean();
};

const createOrUpdateKeyToken = async ({ userId, publicKey, refreshToken }) => {
  const filter = { user: userId };
  const update = {
    publicKey,
    refreshToken,
  };
  const options = { upsert: true, new: true };

  return await KeyModel.findOneAndUpdate(filter, update, options);
};

const removeKeyByUserIdRepo = async (userId) => {
  if (!userId) {
    throw new Error("Invalid userId");
  }

  const key = await KeyModel.findOne({ user: userId });

  if (!key) {
    return { message: "User key not found." };
  }

  await KeyModel.deleteOne({ _id: key._id });
  return { message: "Delete successfully" };
};

export const keyTokenRepository = {
  findKeyByUserId,
  findKeyById,
  createOrUpdateKeyToken,
  removeKeyByUserIdRepo,
};
