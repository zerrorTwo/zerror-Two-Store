import express from "express";
import {
  createNewUserAddress,
  getAllCity,
  getAllDistrict,
  getAllUserAddress,
  getAllWard,
  getUserAddressById,
} from "../../controllers/address.controller.js";
import { authentication } from "../../auth/auth.util.js";

const Router = express.Router();

Router.route("/city").get(getAllCity);
Router.route("/district").get(getAllDistrict);
Router.route("/ward").get(getAllWard);
Router.use(authentication);
Router.route("/").get(getUserAddressById);
Router.route("/:userId").post(createNewUserAddress).get(getAllUserAddress);

export const addressRoute = Router;
