import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "./userRoute.js";
import { authRoute } from "./authRoute.js";
import { categoryRouter } from "./categoryRoute.js";
import { productRoute } from "./productRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIS V1 are ready to use" });
});

Router.use("/auth", authRoute);
Router.use("/users", userRoute);
Router.use("/category", categoryRouter);
Router.use("/products", productRoute);

export const APIS_V1 = Router;
