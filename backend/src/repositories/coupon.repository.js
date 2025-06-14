import CouponModel from "../models/coupon.model.js";
import CartModel from "../models/cart.model.js";

const findAllCoupons = async (page = 1, limit = 10, search = "") => {
  try {
    // Convert page and limit to integers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;

    // Create search filter if search parameter is provided
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search in name
            { code: { $regex: search, $options: "i" } }, // Case-insensitive search in code
          ],
        }
      : {};

    const couponsPipeline = [
      { $match: searchFilter }, // Apply search filter
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          // Select only the necessary fields
          _id: 1,
          name: 1,
          code: 1,
          start_day: 1,
          end_day: 1,
          type: 1,
          value: 1,
          target_type: 1,
          uses_count: 1,
          is_public: 1,
          is_active: 1,
        },
      },
    ];
    const coupons = await CouponModel.aggregate(couponsPipeline);

    // Format dates after retrieving from MongoDB
    const formattedCoupons = coupons.map((coupon) => ({
      ...coupon,
      start_day: coupon.start_day
        ? new Date(coupon.start_day).toISOString().split("T")[0]
        : null,
      end_day: coupon.end_day
        ? new Date(coupon.end_day).toISOString().split("T")[0]
        : null,
    }));

    const totalCoupons = await CouponModel.countDocuments({ ...searchFilter });
    const totalPages = Math.ceil(totalCoupons / limit);

    return {
      page,
      limit,
      totalPages,
      totalCoupons,
      coupons: formattedCoupons,
    };
  } catch (error) {
    throw error;
  }
};

const findCouponByCode = async (code) => {
  return await CouponModel.findOne({ code }).lean();
};

const getAllActivePublicCoupons = async () => {
  const today = new Date();

  return await CouponModel.find({
    is_active: true,
    is_public: true,
    end_day: { $gte: today },
  }).lean();
};

const createNewCoupon = async (data) => {
  return await CouponModel.create(data);
};

const getProductCoupon = async (productId) => {
  return await CouponModel.find({ target_ids: { $in: [productId] } }).lean();
};

const updateCouponUsage = async (code, userId, session) => {
  return await CouponModel.findOneAndUpdate(
    { code },
    {
      $inc: { uses_count: 1 },
      $push: {
        user_uses: {
          $each: [
            {
              userId,
              usageCount: {
                $cond: {
                  if: { $in: [userId, "$user_uses.userId"] },
                  then: {
                    $add: [
                      {
                        $arrayElemAt: [
                          "$user_uses.usageCount",
                          { $indexOfArray: ["$user_uses.userId", userId] },
                        ],
                      },
                      1,
                    ],
                  },
                  else: 1,
                },
              },
            },
          ],
        },
      },
    },
    { session, returnDocument: "after" }
  );
};

export const couponRepository = {
  findAllCoupons,
  findCouponByCode,
  createNewCoupon,
  getAllActivePublicCoupons,
  getProductCoupon,
  updateCouponUsage,
};
