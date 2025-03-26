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
  value,
  max_value,
  min_value,
  max_uses,
  max_uses_per_user,
  target_type,
  target_ids,
  is_public,
  is_active
) => {
  try {
    if (
      !name ||
      !code ||
      !start_day ||
      !end_day ||
      !type ||
      !value ||
      !max_value ||
      !min_value ||
      !max_uses ||
      !max_uses_per_user ||
      !target_type ||
      !target_ids ||
      typeof is_public !== "boolean" ||
      typeof is_active !== "boolean"
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required fields");
    }
    const exitsCoupon = await couponRepository.findCouponByCode(code);
    if (exitsCoupon) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon already exists");
    }
    if (
      new Date(start_day) > new Date(end_day) ||
      new Date(start_day).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ||
      new Date(end_day).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid date range");
    }
    if (type !== "PERCENT" && type !== "AMOUNT") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid type");
    }
    if (type === "PERCENT" && (value < 0 || value > 100)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid discount");
    }
    if (type === "AMOUNT" && (value < 0 || value > max_value)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Value must be between 0 and max_value");
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
        if (value >= minProductPrice) {
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
    code = code.toUpperCase();
    const data = {
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
    };

    const newCoupon = await couponRepository.createNewCoupon(data);

    return newCoupon;
  } catch (error) {
    throw error;
  }
};

const findAllCoupons = async (page, limit, search) => {
  return await couponRepository.findAllCoupons(page, limit, search);
};

const findCouponByCode = async (code) => {
  try {
    const coupon = await couponRepository.findCouponByCode(code);
    return coupon;
  } catch (error) {
    throw error;
  }
};

const getAllCouponAvailable = async (userId) => {
  return await couponRepository.getAllCouponAvailable(userId);
};

export const couponService = {
  createNewCoupon,
  findAllCoupons,
  findCouponByCode,
  getAllCouponAvailable
};
