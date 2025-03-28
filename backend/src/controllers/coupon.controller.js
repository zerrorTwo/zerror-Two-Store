import { StatusCodes } from "http-status-codes";
import asyncHandeler from "../middlewares/async.handler.js";
import { couponService } from "../services/coupon.service.js";

const findAllCoupons = asyncHandeler(async (req, res) => {
  const { page, limit, search } = req.query;
  const coupons = await couponService.findAllCoupons(page, limit, search);
  res.status(StatusCodes.OK).json(coupons);
});

const findCouponByCode = asyncHandeler(async (req, res) => {
  const { code } = req.query;
  const coupon = await couponService.findCouponByCode(code);
  res.status(StatusCodes.OK).json(coupon || null);
});

const getAllCouponAvailable = asyncHandeler(async (req, res) => {
  const userId = req.userId;
  const coupons = await couponService.getAllCouponAvailable(userId);
  res.status(StatusCodes.OK).json(coupons);
});

const getProductCoupon = asyncHandeler(async (req, res) => {
  const userId = req.userId;
  const productId = req.params.productId;
  const coupons = await couponService.getProductCoupon(userId, productId);
  res.status(StatusCodes.OK).json(coupons);
});

const createNewCoupon = asyncHandeler(async (req, res) => {
  const {
    name,
    description,
    code,
    start_day,
    end_day,
    type,
    value,
    max_value,
    min_value,
    max_uses,
    max_uses_per_user,
    target_type,
    target_ids,
    is_public,
    is_active,
  } = req.body;
  const coupon = await couponService.createNewCoupon(
    name,
    description,
    code,
    start_day,
    end_day,
    type,
    value,
    max_value,
    min_value,
    max_uses,
    max_uses_per_user,
    target_type,
    target_ids,
    is_public,
    is_active
  );
  res.status(StatusCodes.CREATED).json(coupon);
});

const checkPrivateCoupon = asyncHandeler(async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;
  const coupon = await couponService.checkPrivateCode(code, userId);
  res.status(StatusCodes.OK).json(coupon);
});

export {
  findAllCoupons,
  findCouponByCode,
  getAllCouponAvailable,
  createNewCoupon,
  checkPrivateCoupon,
  getProductCoupon,
};
