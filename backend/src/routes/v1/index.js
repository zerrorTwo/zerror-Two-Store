import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "./userRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIS V1 are ready to use" });
});

Router.use("/users", userRoute);

export const APIS_V1 = Router;
