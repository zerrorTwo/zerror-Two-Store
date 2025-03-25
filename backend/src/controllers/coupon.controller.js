import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { couponService } from "../services/coupon.service.js";

const findAllCoupons = asyncHandeler(async (req, res) => {
  const { page, limit } = req.query;
  const coupons = await couponService.findAllCoupons(page, limit);
  res.status(StatusCodes.OK).json(coupons);
});

const findCouponByCode = asyncHandeler(async (req, res) => {
  const { code } = req.query;
  const coupon = await couponService.findCouponByCode(code);
  res.status(StatusCodes.OK).json(coupon || null);
});

const createNewCoupon = asyncHandeler(async (req, res) => {
  const {
    name,
    description,
    code,
    start_day,
    end_day,
    type,
    discount,
    max_discount,
    min_value,
    max_uses,
    max_uses_per_user,
    target_type,
    target_ids
  } = req.body;
  const coupon = await couponService.createNewCoupon(
    name,
    description,
    code,
    start_day,
    end_day,
    type,
    discount,
    max_discount,
    min_value,
    max_uses,
    max_uses_per_user,
    target_type,
    target_ids
  );
  res.status(StatusCodes.CREATED).json(coupon);
});

export { findAllCoupons, findCouponByCode, createNewCoupon };
