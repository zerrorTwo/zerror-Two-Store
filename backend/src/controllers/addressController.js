import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/asyncHandler.js";
import { addressService } from "../services/addressService.js";

const getAllCity = asyncHandeler(async (req, res) => {
  const cities = await addressService.getAllCity();
  res.status(StatusCodes.OK).json(cities);
});

const getAllDistrict = asyncHandeler(async (req, res) => {
  const { id } = req.query;
  const districts = await addressService.getAllDistrict(id);
  res.status(StatusCodes.OK).json(districts);
});

const getAllWard = asyncHandeler(async (req, res) => {
  const { id } = req.query;
  const wards = await addressService.getAllWard(id);
  res.status(StatusCodes.OK).json(wards);
});

export { getAllCity, getAllDistrict, getAllWard };
