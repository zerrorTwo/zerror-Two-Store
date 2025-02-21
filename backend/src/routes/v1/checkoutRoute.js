import express from "express";
import { authentication, authorization } from "../../auth/authUtil.js";
import { getProductCheckout } from "../../controllers/checkoutController.js";

const Router = express.Router();

// Router.use(authentication, authorization);
Router.route("/").get(getProductCheckout);

export const checkoutRoute = Router;
