import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

export const findByIdConvert = async (Model, id, options = {}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID format");
  }

  const document = await Model.findById(id, options).lean();

  if (!document) {
    throw new ApiError(StatusCodes.NOT_FOUND, `${Model.modelName} not found`);
  }

  return document;
};
