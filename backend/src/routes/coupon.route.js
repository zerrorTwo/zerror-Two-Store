import express from "express";
import { createNewCoupon, findAllCoupons } from "../controllers/coupon.controller.js";

const Router = express.Router();

Router.route("/").post(createNewCoupon).get(findAllCoupons);

export const couponRoute = Router;
