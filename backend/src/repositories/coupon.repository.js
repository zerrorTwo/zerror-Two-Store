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
            { name: { $regex: search, $options: 'i' } },  // Case-insensitive search in name
            { code: { $regex: search, $options: 'i' } }   // Case-insensitive search in code
          ] 
        } 
      : {};
    
    const couponsPipeline = [
      { $match: searchFilter }, // Apply search filter
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
    const formattedCoupons = coupons.map(coupon => ({
      ...coupon,
      start_day: coupon.start_day ? new Date(coupon.start_day).toISOString().split('T')[0] : null,
      end_day: coupon.end_day ? new Date(coupon.end_day).toISOString().split('T')[0] : null
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
    console.error("Error in findAllCoupons:", error);
    throw error;
  }
};

const findCouponByCode = async (code) => {
  return await CouponModel.findOne({ code }).lean();
};

const getAllCouponAvailable = async (userId) => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const allCoupons = await CouponModel.find({ 
      is_active: true, 
      is_public: true,
      end_day: { $gte: currentDateString } // Compare with string date format
    }).lean();
    
    if (!userId) return allCoupons;
    
    // Separate coupons by target_type
    const productCoupons = allCoupons.filter(coupon => coupon.target_type === "PRODUCT");
    const otherCoupons = allCoupons.filter(coupon => coupon.target_type !== "PRODUCT");
    
    const userCart = await CartModel.findOne({ 
      userId, 
      state: "ACTIVE" 
    }).lean();
    
    // If no cart or empty cart, return only non-product coupons
    if (!userCart || !userCart.products || userCart.products.length === 0) {
      return otherCoupons;
    }
    
    const checkoutProducts = userCart.products.filter(product => 
      product.variations && product.variations.some(variation => variation.checkout === true)
    );
    
    // If no products are marked for checkout, return only non-product coupons
    if (checkoutProducts.length === 0) {
      return otherCoupons;
    }
    
    const checkoutProductIds = checkoutProducts.map(item => item.productId.toString());
    
    // Filter only product coupons based on checkout items
    const filteredProductCoupons = productCoupons.filter(coupon => {
      if (!coupon.target_ids || coupon.target_ids.length === 0) return true;
      
      return coupon.target_ids.some(targetId => 
        checkoutProductIds.includes(targetId.toString())
      );
    });
    
    // Return filtered product coupons + all other coupons
    return [...filteredProductCoupons, ...otherCoupons];
  } catch (error) {
    console.error("Error in getAllCouponAvailable:", error);
    throw error;
  }
};

const createNewCoupon = async (data) => {
  return await CouponModel.create(data);
};

export const couponRepository = {
  findAllCoupons,
  findCouponByCode,
  createNewCoupon,
  getAllCouponAvailable
};
