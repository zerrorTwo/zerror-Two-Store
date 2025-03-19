import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import AddressModel from "../models/address.model.js";

const findAddressById = async (addressId, userId, session) => {
  return await AddressModel.findOne({
    _id: addressId,
    userId,
  }).session(session);
};

const findCartItemsByUserId = async (userId, session) => {
  return await CartModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$products" },
    {
      $project: {
        productId: "$products.productId",
        hasVariations: { $gt: [{ $size: "$products.variations" }, 0] },
        variations: "$products.variations",
        quantity: { $ifNull: ["$products.quantity", 1] },
        price: { $ifNull: ["$products.price", 0] },
        checkout: { $ifNull: ["$products.checkout", false] },
      },
    },
    {
      $project: {
        productId: 1,
        variations: {
          $cond: {
            if: "$hasVariations",
            then: "$variations",
            else: [
              {
                price: "$price",
                quantity: "$quantity",
                checkout: "$checkout",
              },
            ],
          },
        },
      },
    },
    { $unwind: "$variations" },
    { $match: { "variations.checkout": true } },
    {
      $group: {
        _id: null,
        products: {
          $push: { productId: "$productId", variation: "$variations" },
        },
        totalItems: { $sum: "$variations.quantity" },
        totalPrice: {
          $sum: {
            $multiply: ["$variations.price", "$variations.quantity"],
          },
        },
      },
    },
  ]).session(session);
};

const findProductsByIds = async (productIds, session) => {
  return await ProductModel.find({
    _id: { $in: productIds },
  }).session(session);
};

const createNewOrder = async (orderData, session) => {
  return await OrderModel.create([orderData], { session });
};

const updateCartAfterOrder = async (userId, session) => {
  // Xóa các biến thể đã checkout khỏi giỏ hàng
  await CartModel.updateOne(
    { userId },
    { $pull: { "products.$[].variations": { checkout: true } } },
    { session }
  );

  // Xóa sản phẩm nếu không còn biến thể nào
  await CartModel.updateMany(
    { userId },
    { $pull: { products: { variations: { $size: 0 } } } },
    { session }
  );
};

const findPaginatedOrders = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  return await OrderModel.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $sort: { updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);
};

const findOrdersWithDetails = async (orderIds) => {
  return await OrderModel.aggregate([
    { $match: { _id: { $in: orderIds.map((o) => o._id) } } },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $addFields: {
        "products.name": { $arrayElemAt: ["$productInfo.name", 0] },
        "products.mainImg": { $arrayElemAt: ["$productInfo.mainImg", 0] },
        sortIndex: {
          $indexOfArray: [orderIds.map((o) => o._id), "$_id"],
        },
      },
    },
    {
      $project: {
        productDetails: 0,
        productInfo: 0,
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        state: { $first: "$state" },
        deliveryState: { $first: "$deliveryState" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        paymentMethod: { $first: "$paymentMethod" },
        paymentStatus: { $first: "$paymentStatus" },
        deliveryFee: { $first: "$deliveryFee" },
        totalPrice: { $first: "$totalPrice" },
        finalTotal: { $first: "$finalTotal" },
        products: { $push: "$products" },
        sortIndex: { $first: "$sortIndex" },
      },
    },
    { $sort: { sortIndex: 1 } },
  ]);
};

const countUserOrders = async (userId) => {
  return await OrderModel.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });
};

const findOrdersByTimeRange = async (userId, startDate, endDate) => {
  return await OrderModel.find({
    userId,
    createdAt: { $gte: startDate, $lt: endDate },
  })
    .select("finalTotal totalItems")
    .lean();
};

const findCartCheckoutItems = async (userId) => {
  return await CartModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        state: "ACTIVE",
      },
    },
    { $unwind: "$products" },
    {
      $match: {
        "products.variations.checkout": true,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    {
      $set: {
        "products.variations": {
          $filter: {
            input: "$products.variations",
            as: "variation",
            cond: { $eq: ["$$variation.checkout", true] },
          },
        },
      },
    },
    {
      $match: {
        "products.variations": { $ne: [] },
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$products.productId",
        cartQuantity: "$products.quantity",
        cartVariations: "$products.variations",
        productName: "$productDetails.name",
        productImages: "$productDetails.mainImg",
        productSlug: "$productDetails.slug",
        stock: "$productDetails.stock",
        sold: "$productDetails.sold",
        status: "$productDetails.status",
        type: "$productDetails.type",
        rating: "$productDetails.rating",
        productVariations: "$productDetails.variations",
        price: "$productDetails.price",
        createdAt: "$products.createdAt",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: null,
        products: { $push: "$$ROOT" },
        totalItems: { $sum: { $size: "$cartVariations" } },
        totalPrice: {
          $sum: {
            $reduce: {
              input: "$cartVariations",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $multiply: ["$$this.price", "$$this.quantity"] },
                ],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        products: 1,
        totalItems: 1,
        totalPrice: 1,
      },
    },
  ]);
};

const findOrderById = async (orderId) => {
  return await OrderModel.findById(orderId);
};

export {
  findAddressById,
  findCartItemsByUserId,
  findProductsByIds,
  createNewOrder,
  updateCartAfterOrder,
  findPaginatedOrders,
  findOrdersWithDetails,
  countUserOrders,
  findOrdersByTimeRange,
  findCartCheckoutItems,
  findOrderById,
};
