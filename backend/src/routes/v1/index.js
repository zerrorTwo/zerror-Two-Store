import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "./user.route.js";
import { authRoute } from "./auth.route.js";
import { categoryRoute } from "./category.route.js";
import { productRoute } from "./product.route.js";
import { uploadRoute } from "./upload.route.js";
import { cartRoute } from "./cart.route.js";
import { addressRoute } from "./address.route.js";
import { paymentRoute } from "./payment.route.js";
import { orderRoute } from "./order.route.js";

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
