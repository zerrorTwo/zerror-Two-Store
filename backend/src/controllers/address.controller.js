import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { addressService } from "../services/address.service.js";

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

const createNewUserAddress = asyncHandeler(async (req, res) => {
  const address = await addressService.createNewUserAddress(req.userId, req.body);
  res.status(StatusCodes.CREATED).json(address);
});

const getAllUserAddress = asyncHandeler(async (req, res) => {
  const address = await addressService.getAllUserAddress(req.userId);
  res.status(StatusCodes.OK).json(address);
});

const getUserAddressById = asyncHandeler(async (req, res) => {
  const { id } = req.query;
  const address = await addressService.getUserAddressById(id);
  res.status(StatusCodes.OK).json(address);
});

export {
  getAllCity,
  getAllDistrict,
  getAllWard,
  createNewUserAddress,
  getAllUserAddress,
  getUserAddressById,
};
