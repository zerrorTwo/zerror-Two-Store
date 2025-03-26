import express from "express";
import { createNewCoupon, findAllCoupons, getAllCouponAvailable } from "../../controllers/coupon.controller.js";
import { authentication } from "../../auth/auth.util.js";
const Router = express.Router();
Router.use(authentication);
Router.route("/").post(createNewCoupon).get(findAllCoupons);
Router.route("/available").get(getAllCouponAvailable);

export const couponRoute = Router;
