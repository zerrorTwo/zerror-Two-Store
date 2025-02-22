import CityModel from "../models/cityModel.js";
import DistrictModel from "../models/districtModel.js";
import WardModel from "../models/wardModel.js";

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

export const addressService = { getAllCity, getAllDistrict, getAllWard };
