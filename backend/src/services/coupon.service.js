import { couponRepository } from "../repositories/coupon.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";

const createNewCoupon = async (
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
) => {
  try {
    if (
      !name ||
      !code ||
      !start_day ||
      !end_day ||
      !type ||
      !discount ||
      !max_discount ||
      !min_value ||
      !max_uses ||
      !max_uses_per_user ||
      !target_type ||
      !target_ids
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
    }
    const exitsCoupon = await couponRepository.findCouponByCode(code);
    if (exitsCoupon) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon already exists");
    }
    if (
      new Date(start_day) > new Date(end_day) ||
      new Date(start_day) < new Date() ||
      new Date(end_day) < new Date()
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid date range");
    }
    if (type !== "PERCENT" && type !== "AMOUNT") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid type");
    }
    if (type === "PERCENT" && (discount < 0 || discount > 100)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid discount");
    }
    if (type === "AMOUNT" && (discount < 0 || discount > max_discount)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid discount");
    }
    if (target_type !== "FREESHIPPING" && target_type !== "PRODUCT" && target_type !== "ORDER" && target_type !== "DISCOUNT") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid target type");
    }
    if (target_type === "PRODUCT") {
      if (!target_ids || !Array.isArray(target_ids) || target_ids.length === 0) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid target ids");
      }
      
      if (type === "AMOUNT") {
        const products = await productRepository.findProductsByIds(target_ids);
        if (products.length === 0) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "No products found with the provided IDs");
        }
        
        const minProductPrice = Math.min(...products.map(product => product.minPrice));
        if (discount >= minProductPrice) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "Discount amount must be less than the minimum price of targeted products");
        }
      }
    }
    if (min_value < 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid min value");
    }
    if (max_uses < 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid max uses");
    }
    if (max_uses_per_user < 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid max uses per user");
    }
    const data = {
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
    };
    const newCoupon = await couponRepository.createCoupon(data);

    return newCoupon;
  } catch (error) {
    throw error;
  }
};

const findAllCoupons = async (page, limit) => {
  try {
    const coupons = await couponRepository.findAllCoupons(page, limit);
    return coupons;
  } catch (error) {
    throw error;
  }
};

const findCouponByCode = async (code) => {
  try {
    const coupon = await couponRepository.findCouponByCode(code);
    return coupon;
  } catch (error) {
    throw error;
  }
};

export const couponService = {
  createNewCoupon,
  findAllCoupons,
  findCouponByCode,
};
