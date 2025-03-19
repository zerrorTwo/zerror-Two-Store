import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import {
  findAllCities,
  findDistrictsByProvinceId,
  findWardsByDistrictId,
  findUserById,
  countUserAddresses,
  updateAllUserAddresses,
  createNewAddress,
  findAllUserAddresses,
  findAddressById,
} from "../repositories/address.repository.js";

const getAllCity = async () => {
  try {
    const cities = await findAllCities();
    return cities;
  } catch (error) {
    throw error;
  }
};

const getAllDistrict = async (id) => {
  try {
    const districts = await findDistrictsByProvinceId(id);
    return districts;
  } catch (error) {
    throw error;
  }
};

const getAllWard = async (id) => {
  try {
    const wards = await findWardsByDistrictId(id);
    return wards;
  } catch (error) {
    throw error;
  }
};

const createNewUserAddress = async (userId, data) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!!");
    }

    const count = await countUserAddresses(userId);

    // Nếu user chưa có địa chỉ nào, set địa chỉ này làm mặc định
    if (count === 0) {
      data.setDefault = true;
    }

    // Nếu địa chỉ mới là mặc định, đặt tất cả địa chỉ cũ về false trước
    if (data.setDefault) {
      await updateAllUserAddresses(userId, { $set: { setDefault: false } });
    }

    const newAddress = await createNewAddress({ userId, ...data });

    return newAddress;
  } catch (error) {
    throw error;
  }
};

const getAllUserAddress = async (userId) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!!");
    }

    const addresses = await findAllUserAddresses(userId);
    return addresses;
  } catch (error) {
    throw error;
  }
};

const getUserAddressById = async (id) => {
  try {
    const address = await findAddressById(id);
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
