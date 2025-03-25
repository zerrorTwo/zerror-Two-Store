import CouponModel from "../models/coupon.model.js";

const findAllCoupons = async (page = 1, limit = 10) => {
  try {
    // Convert page and limit to integers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;
    const couponsPipeline = [
      { $match: {} }, // Add any filters if needed
      { $skip: skip },
      { $limit: limit },
      {
        $project: { // Select only the necessary fields
          _id: 1,
          name: 1,
          code: 1,
          start_day: 1,
          end_day: 1,
          type: 1,
          discount: 1,
          target_type: 1,
          uses_count: 1,
          is_public: 1,
          is_active: 1,
        },
      },
    ];
    const coupons = await CouponModel.aggregate(couponsPipeline);
    const totalCoupons = await CouponModel.countDocuments();

    return {
      page,
      limit,
      totalPages: Math.ceil(totalCoupons / limit),
      totalCoupons,
      coupons,
    };
  } catch (error) {
    throw error;
  }
};

const findCouponByCode = async (code) => {
  return await CouponModel.findOne({ code }).lean();
};

const createNewCoupon = async (data) => {
  return await CouponModel.create(data);
};

export const couponRepository = {
  findAllCoupons,
  findCouponByCode,
  createNewCoupon,
};
