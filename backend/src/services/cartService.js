import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import mongoose from "mongoose";
import CartModel from "../models/CartModel.js"

const addToCart = async (userId, products= {}) => {
    const userCart = await CartModel.findOne({userId: userId})
    if (!userCart) {
        return await cartService.createCart(userId, products)
    }

    if (!userCart.products.length){
        userCart.products = [products]
        return await userCart.save()
    }
    return await cartService.updateUserCartQuantity(userId, products)
}

const updateUserCartQuantity = async (userId, products= {}) => {
    const {productId, quantity} = products
    const query = {userId: userId, "products.productId": productId, state: 'ACTIVE'},
    updateSet = {
        $inc: 'products.$.quantity' = quantity
    }, options = {upsert: true, new: true}
    return await CartModel.findOneAndUpdate(query, updateSet, options)
}

const createCart = async (userId, products= {}) => {
  try {
    const query = { userId: userId, state: 'ACTIVE'},
    updateOrInsert = {
        $addToSet: {
            products: products
        }
    }, options = {upsert: true, new: true}

    return await CartModel.findByIdAndUpdate(query, updateOrInsert, options)
  } catch (error) {
    throw error
  }
};




export const cartService = {
    addToCart, 
    createCart,
    updateUserCartQuantity
};
