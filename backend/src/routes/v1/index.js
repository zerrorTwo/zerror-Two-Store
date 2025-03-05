import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "./userRoute.js";
import { authRoute } from "./authRoute.js";
import { categoryRoute } from "./categoryRoute.js";
import { productRoute } from "./productRoute.js";
import { uploadRoute } from "./uploadRoute.js";
import { cartRoute } from "./cartRoute.js";
import { addressRoute } from "./addressRoute.js";
import { paymentRoute } from "./paymentRoute.js";
import { orderRoute } from "./orderRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIS V1 are ready to use" });
});

Router.use("/auth", authRoute);
Router.use("/users", userRoute);
Router.use("/category", categoryRoute);
Router.use("/products", productRoute);
Router.use("/cart", cartRoute);
Router.use("/order", orderRoute);
Router.use("/address", addressRoute);
Router.use("/payment", paymentRoute);
Router.use("/upload", uploadRoute); // Use uploadRoute for handling uploads

export const APIS_V1 = Router;
