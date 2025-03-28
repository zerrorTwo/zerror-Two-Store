import express from "express";
import {
  checkPrivateCoupon,
  createNewCoupon,
  findAllCoupons,
  getAllCouponAvailable,
  getProductCoupon,
} from "../../controllers/coupon.controller.js";
import { authentication } from "../../auth/auth.util.js";
const Router = express.Router();
Router.use(authentication);
Router.route("/").post(createNewCoupon).get(findAllCoupons);
Router.route("/available").get(getAllCouponAvailable);
Router.route("/apply-private").post(checkPrivateCoupon);
Router.route("/:productId").get(getProductCoupon);

export const couponRoute = Router;
