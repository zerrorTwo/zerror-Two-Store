import express from "express";
import {
  createNewUserAddress,
  getAllCity,
  getAllDistrict,
  getAllUserAddress,
  getAllWard,
} from "../../controllers/addressController.js";
import { authentication } from "../../auth/authUtil.js";

const Router = express.Router();

Router.route("/city").get(getAllCity);
Router.route("/district").get(getAllDistrict);
Router.route("/ward").get(getAllWard);
Router.use(authentication);
Router.route("/").get(getAllUserAddress);
Router.route("/:userId").post(createNewUserAddress);

export const addressRoute = Router;
