import mongoose from "mongoose";
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

const findCartByUserId = async (userId) => {
  return await CartModel.findOne({ userId });
};

const findActiveCartByUserId = async (userId) => {
  return await CartModel.findOne({ userId, state: "ACTIVE" });
};

const findProductById = async (productId) => {
  return await ProductModel.findById(productId);
};

const createNewCart = async (cartData) => {
  const newCart = new CartModel(cartData);
  return await newCart.save();
};

const updateCart = async (userId, updateData) => {
  return await CartModel.findOneAndUpdate(
    { userId, state: "ACTIVE" },
    updateData,
    { new: true, upsert: true }
  );
};

const updateAllCheckoutStatus = async (userId, newState) => {
  return await CartModel.updateOne(
    { userId, state: "ACTIVE" },
    { $set: { "products.$[].variations.$[].checkout": newState } }
  );
};

const findActiveCartWithAggregate = async (userId) => {
  return await CartModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        state: "ACTIVE",
      },
    },
    { $unwind: "$products" },
    { $unwind: "$products.variations" },
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
      $project: {
        _id: 0,
        productId: "$products.productId",
        variationType: "$products.variations.type",
        variationPrice: "$products.variations.price",
        variationQuantity: "$products.variations.quantity",
        variationCheckout: "$products.variations.checkout",
        productName: "$productDetails.name",
        productImages: "$productDetails.mainImg",
        productSlug: "$productDetails.slug",
        totalPrice: {
          $multiply: [
            "$products.variations.quantity",
            "$products.variations.price",
          ],
        },
        createdAt: "$products.createdAt",
        productCreatedAt: "$products.createdAt",
      },
    },
  ]);
};

const getCartSummary = async (userId) => {
  return await CartModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        state: "ACTIVE",
      },
    },
    { $unwind: "$products" },
    { $unwind: "$products.variations" },
    {
      $group: {
        _id: null,
        totalItems: { $sum: "$products.variations.quantity" },
        totalVariations: { $sum: 1 },
        totalPrice: {
          $sum: {
            $multiply: [
              "$products.variations.quantity",
              "$products.variations.price",
            ],
          },
        },
      },
    },
  ]);
};

const getPaginatedCart = async (userId, skip, limit) => {
  return await CartModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        state: "ACTIVE",
      },
    },
    { $unwind: "$products" },
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
        totalItems: { $sum: "$products.quantity" },
        totalPrice: {
          $sum: {
            $multiply: ["$products.quantity", "$products.price"],
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        products: 1,
        totalItems: 1,
        totalPrice: 1,
      },
    },
  ]);
};

const removeCheckoutVariations = async (userId, session) => {
  return await CartModel.updateOne(
    { userId },
    { $pull: { "products.$[].variations": { checkout: true } } },
    { session }
  );
};

const removeEmptyProducts = async (userId, session) => {
  return await CartModel.updateMany(
    { userId },
    { $pull: { products: { variations: { $size: 0 } } } },
    { session }
  );
};

export const cartRepository = {
  findCartByUserId,
  findActiveCartByUserId,
  findProductById,
  createNewCart,
  updateCart,
  updateAllCheckoutStatus,
  findActiveCartWithAggregate,
  getCartSummary,
  getPaginatedCart,
  removeCheckoutVariations,
  removeEmptyProducts,
};
