import CityModel from "../models/city.model.js";
import DistrictModel from "../models/district.model.js";
import WardModel from "../models/ward.model.js";
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

const findAllCities = async () => {
  return await CityModel.find({}).lean();
};

const findDistrictsByProvinceId = async (provinceId) => {
  return await DistrictModel.find({ provinceId }).lean();
};

const findWardsByDistrictId = async (districtId) => {
  return await WardModel.find({ districtId }).lean();
};

const findUserById = async (userId) => {
  return await UserModel.findOne({ _id: userId });
};

const countUserAddresses = async (userId) => {
  return await AddressModel.countDocuments({ userId });
};

const updateAllUserAddresses = async (userId, updateData) => {
  return await AddressModel.updateMany({ userId }, updateData);
};

const createNewAddress = async (data) => {
  return await AddressModel.create(data);
};

const findAllUserAddresses = async (userId) => {
  return await AddressModel.find({ userId })
    .select("-userId")
    .populate("city")
    .populate("district")
    .populate("ward")
    .sort({ setDefault: -1, createdAt: -1 })
    .lean();
};

const findAddressById = async (id) => {
  return await AddressModel.findById(id)
    .select("-userId")
    .populate("city")
    .populate("district")
    .populate("ward")
    .lean();
};

export const addressRepository = {
  findAllCities,
  findDistrictsByProvinceId,
  findWardsByDistrictId,
  findUserById,
  countUserAddresses,
  updateAllUserAddresses,
  createNewAddress,
  findAllUserAddresses,
  findAddressById,
};
