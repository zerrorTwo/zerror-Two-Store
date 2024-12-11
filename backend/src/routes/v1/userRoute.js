import express from "express";
import { createUser } from "../../controllers/userController.js";

const Router = express.Router();

Router.route("/").post(createUser);

export const userRoute = Router;
