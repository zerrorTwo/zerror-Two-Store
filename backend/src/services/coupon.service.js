import { cartRepository } from "../repositories/cart.repository.js";
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
    checkCoupon(
      name,
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
    if (target_type === "PRODUCT") {
      if (
        !target_ids ||
        !Array.isArray(target_ids) ||
        target_ids.length === 0
      ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid target ids");
      }

      if (type === "AMOUNT") {
        const products = await productRepository.findProductsByIds(target_ids);
        if (products.length === 0) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "No products found with the provided IDs"
          );
        }

        const minProductPrice = Math.min(
          ...products.map((product) => product.minPrice)
        );
        if (value >= minProductPrice) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Discount amount must be less than the minimum price of targeted products"
          );
        }
      }
    }
    code = code.toUpperCase();

    const checkouCouponResult = await couponRepository.findCouponByCode(code);
    if (checkouCouponResult) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon already exists");
    }
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
      is_active,
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

const getProductCoupon = async (userId, productId) => {
  const coupons = await couponRepository.getProductCoupon(productId);

  const availableCoupons = coupons.filter((coupon) => {
    if (coupon?.user_uses && coupon?.user_uses?.length > 0) {
      const userUsageIndex = coupon.user_uses
        ? coupon.user_uses.findIndex((user) => user.userId === userId)
        : -1; // Check if user_uses exists

      const userUsageCount =
        userUsageIndex !== -1 ? coupon.user_uses[userUsageIndex].usageCount : 0;

      return (
        userUsageCount < coupon.max_uses_per_user &&
        coupon.uses_count < coupon.max_uses
      );
    }
    return true;
  });

  return availableCoupons;
};

const getAllCouponAvailable = async (userId) => {
  const allCoupons = await couponRepository.getAllActivePublicCoupons();

  const otherCoupons = allCoupons.filter(
    (coupon) => coupon.target_type !== "PRODUCT"
  );

  const availableCoupons = otherCoupons.filter((coupon) => {
    if (coupon.user_uses && coupon.user_uses.length > 0) {
      const userUsageIndex = coupon.user_uses.findIndex(
        (user) => user.userId === userId
      );
      const userUsageCount =
        userUsageIndex !== -1 ? coupon.user_uses[userUsageIndex].usageCount : 0;

      return (
        userUsageCount < coupon.max_uses_per_user &&
        coupon.uses_count < coupon.max_uses
      );
    }
    return true;
  });

  return availableCoupons;
};

const checkCoupon = async (
  name,
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
  if (type === "PERCENT" && (value < 0 || value > 100)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid discount");
  }
  if (type === "AMOUNT" && (value < 0 || value > max_value)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Value must be between 0 and max_value"
    );
  }
  if (
    target_type !== "FREESHIPPING" &&
    target_type !== "PRODUCT" &&
    target_type !== "ORDER" &&
    target_type !== "DISCOUNT"
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid target type");
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
};

const checkPrivateCode = async (code, userId) => {
  code = code.toUpperCase();
  const coupon = await findCouponByCode(code);
  if (!coupon) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid coupon code");
  }
  checkCoupon(
    coupon?.name,
    coupon?.code,
    coupon?.start_day,
    coupon?.end_day,
    coupon?.type,
    coupon?.value,
    coupon?.max_value,
    coupon?.min_value,
    coupon?.max_uses,
    coupon?.max_uses_per_user,
    coupon?.target_type,
    coupon?.target_ids,
    coupon?.is_public,
    coupon?.is_active
  );
  if (coupon?.uses_count >= coupon?.max_uses) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Coupon has reached its maximum usage"
    );
  }

  const user_cart = await cartRepository.findCartByUserId(userId);
  if (!user_cart || !user_cart.products || user_cart.products.length === 0)
    return null;

  if (coupon.target_type === "PRODUCT" && coupon.target_ids.length > 0) {
    const checkoutProductIds = user_cart.products
      .filter(
        (product) =>
          product.variations &&
          product.variations.some((variation) => variation.checkout === true)
      )
      .map((item) => item.productId.toString());

    const hasMatchingProduct = coupon.target_ids.some((targetId) =>
      checkoutProductIds.includes(targetId.toString())
    );

    if (!hasMatchingProduct) return null;
  }
  const userUsageIndex = coupon.user_uses.findIndex(
    (user) => user.userId.toString() === userId.toString()
  );

  if (userUsageIndex !== -1) {
    const userUsageCount = coupon.user_uses[userUsageIndex].usageCount;
    if (userUsageCount >= coupon.max_uses_per_user) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "User has reached the maximum usage limit for this coupon"
      );
    }
  }
  return coupon;
};

const useCoupon = async (code, userId) => {
  checkCoupon(
    code?.name,
    code?.code,
    code?.start_day,
    code?.end_day,
    code?.type,
    code?.value,
    code?.max_value,
    code?.min_value,
    code?.max_uses,
    code?.max_uses_per_user,
    code?.target_type,
    code?.target_ids,
    code?.is_public,
    code?.is_active
  );
  const coupon = await findCouponByCode(code);
  if (!coupon) return null;

  if (!coupon.is_active) return null;
  if (coupon?.uses_count >= coupon?.max_uses) return null;

  const user_cart = await cartRepository.findCartByUserId(userId);
  if (!user_cart || !user_cart.products || user_cart.products.length === 0)
    return null;

  if (coupon.target_type === "PRODUCT" && coupon.target_ids.length > 0) {
    const checkoutProductIds = user_cart.products
      .filter(
        (product) =>
          product.variations &&
          product.variations.some((variation) => variation.checkout === true)
      )
      .map((item) => item.productId.toString());

    const hasMatchingProduct = coupon.target_ids.some((targetId) =>
      checkoutProductIds.includes(targetId.toString())
    );

    if (!hasMatchingProduct) return null;
  }

  // Check user usage limits
  const userUsageIndex = coupon.user_uses.findIndex(
    (user) => user.userId.toString() === userId.toString()
  );

  if (userUsageIndex !== -1) {
    const userUsageCount = coupon.user_uses[userUsageIndex].usageCount;
    if (userUsageCount >= coupon.max_uses_per_user) return null;
  }

  return coupon;
};

export const couponService = {
  createNewCoupon,
  findAllCoupons,
  findCouponByCode,
  getAllCouponAvailable,
  checkCoupon,
  checkPrivateCode,
  getProductCoupon,
};
