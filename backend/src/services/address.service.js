import CityModel from "../models/city.model.js";
import DistrictModel from "../models/district.model.js";
import WardModel from "../models/ward.model.js";
import AddressModel from "../models/address.model.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js";

const getAllCity = async () => {
  try {
    const cities = await CityModel.find({}).lean();
    return cities;
  } catch (error) {
    throw error;
  }
};

const getAllDistrict = async (id) => {
  try {
    const districts = await DistrictModel.find({ provinceId: id }).lean();
    return districts;
  } catch (error) {
    throw error;
  }
};

const getAllWard = async (id) => {
  try {
    const wards = await WardModel.find({ districtId: id }).lean();
    return wards;
  } catch (error) {
    throw error;
  }
};

const createNewUserAddress = async (userId, data) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!!");
    }

    const count = await AddressModel.countDocuments({ userId });

    // Nếu user chưa có địa chỉ nào, set địa chỉ này làm mặc định
    if (count === 0) {
      data.setDefault = true;
    }

    // Nếu địa chỉ mới là mặc định, đặt tất cả địa chỉ cũ về false trước
    if (data.setDefault) {
      await AddressModel.updateMany(
        { userId },
        { $set: { setDefault: false } }
      );
    }

    const newAddress = await AddressModel.create({ userId, ...data });

    return newAddress;
  } catch (error) {
    throw error;
  }
};

const getAllUserAddress = async (userId) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!!");
    }

    const newAddress = await AddressModel.find({ userId: userId })
      .select("-userId")
      .populate("city")
      .populate("district")
      .populate("ward")
      .sort({ setDefault: -1, createdAt: -1 })
      .lean();

    return newAddress;
  } catch (error) {
    throw error;
  }
};

const getUserAddressById = async (id) => {
  try {
    const address = await AddressModel.findById(id)
      .select("-userId")
      .populate("city")
      .populate("district")
      .populate("ward")
      .lean();

    return address;
  } catch (error) {
    throw error;
  }
};

export const addressService = {
  getAllCity,
  getAllDistrict,
  getAllWard,
  createNewUserAddress,
  getAllUserAddress,
  getUserAddressById,
};
