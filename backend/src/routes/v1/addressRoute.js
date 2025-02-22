import express from "express";
import {
  createNewUserAddress,
  getAllCity,
  getAllDistrict,
  getAllUserAddress,
  getAllWard,
} from "../../controllers/addressController.js";

const Router = express.Router();

// Router.use(authentication, authorization);
Router.route("/").post(createNewUserAddress).get(getAllUserAddress);
Router.route("/city").get(getAllCity);
Router.route("/district").get(getAllDistrict);
Router.route("/ward").get(getAllWard);

export const addressRoute = Router;
