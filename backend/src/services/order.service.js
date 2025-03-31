import mongoose from "mongoose";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import { orderRepository } from "../repositories/order.repository.js";
import { couponService } from "./coupon.service.js";
import { cartRepository } from "../repositories/cart.repository.js";
import { couponRepository } from "../repositories/coupon.repository.js";
import { productRepository } from "../repositories/product.repository.js";

const createOrder = async (data, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const { userId, addressId, paymentMethod, coupons } = data;
      const SHIPPING_FEE = 30000;

      // Validate shipping address
      const address = await orderRepository.findAddressById(
        addressId,
        userId,
        session
      );
      if (!address) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Address not found!");
      }

      // Fetch checked-out cart items
      const cartItems = await orderRepository.findCartItemsByUserId(
        userId,
        session
      );
      if (!cartItems.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Cart is empty!");
      }

      const { products, totalItems, totalPrice } = cartItems[0];

      // Validate product details
      for (const item of products) {
        if (!item.variation?.price) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Product ${item.productId} is missing price!`
          );
        }
        if (!item.variation?.quantity) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Product ${item.productId} is missing quantity!`
          );
        }
      }

      // Fetch product details for stock validation
      const productIds = products.map((item) => item.productId);
      const productList = await productRepository.findProductIdByIds(
        productIds
      );

      // Create a stock map for efficient lookup
      const productStockMap = new Map(
        productList.map((p) => [p._id.toString(), p])
      );

      // Validate and update stock
      for (const item of products) {
        const product = productStockMap.get(item.productId.toString());
        if (!product) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Product ${item.productId} not found!`
          );
        }
        if (product.stock < item.variation.quantity) {
          throw new ApiError(
            StatusCodes.BAD_REQUEST,
            `Not enough stock for product ${item.productId}`
          );
        }
        product.stock -= item.variation.quantity;
      }

      // Bulk update stock
      await Promise.all(productList.map((p) => p.save({ session })));

      // Create draft order

      const newOrder = await orderRepository.createNewOrder(
        [
          {
            userId,
            products: products.map((p) => ({
              productId: p.productId,
              variations: [p.variation],
            })),
            addressId,
            paymentMethod,
            totalItems,
            totalPrice,
          },
        ],
        { session }
      );

      // Handle coupons if provided
      let totalDiscount = 0;
      if (coupons?.length > 0) {
        const couponResults = await Promise.all(
          coupons.map(async (coupon) => {
            const result = await couponService.useCoupon(
              coupon,
              userId,
              totalPrice,
              SHIPPING_FEE
            );
            if (result.error) {
              throw new ApiError(StatusCodes.BAD_REQUEST, result.error);
            }
            return result;
          })
        );
        totalDiscount = couponResults.reduce(
          (sum, result) => sum + result.discount,
          0
        );

        // Update coupon usage with session
        await Promise.all(
          coupons.map((coupon) =>
            couponRepository.updateCouponUsage(coupon, userId, session)
          )
        );
      }

      // Clean up cart
      await cartRepository.removeCheckoutVariations(userId, session);
      await cartRepository.removeEmptyProducts(userId, session);

      // Finalize order
      newOrder[0].totalDiscount = totalDiscount;
      newOrder[0].finalTotal = totalPrice - totalDiscount + SHIPPING_FEE;

      await newOrder[0].save({ session });

      // Commit transaction
      await session.commitTransaction();

      return {
        success: true,
        message: "Order created successfully",
        orders: newOrder,
      };
    } catch (error) {
      await session.abortTransaction();
      // Check if it's a write conflict error (MongoDB error code 112)
      if (error.code === 112 && attempt < retries) {
        console.log(
          `Write conflict detected, retrying (${attempt}/${retries})...`
        );
        continue; // Retry the transaction
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Order creation failed: ${error.message}`
      );
    } finally {
      session.endSession();
    }
  }
  throw new ApiError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Max retries reached, order creation failed due to persistent write conflicts."
  );
};

const getUserOrder = async (userId, page = 1, limit = 2, filter) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 2;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    // Bước 1: Phân trang trước khi lấy sản phẩm
    const paginatedOrders = await orderRepository.findPaginatedOrders(
      userId,
      page,
      limit,
      filter
    );

    const orderIds = paginatedOrders.map((order, index) => ({
      _id: order._id,
      sortIndex: index,
    }));

    if (orderIds.length === 0) {
      return { orders: [], hasMore: false };
    }

    // Bước 2: Lấy thông tin đơn hàng + sản phẩm
    const orders = await orderRepository.findOrdersWithDetails(orderIds);

    // Kiểm tra còn dữ liệu không
    const totalOrders = await orderRepository.countUserOrders(userId);

    return {
      orders,
      hasMore: page * limit < totalOrders,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllOrders = async (page, limit, search) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  try {
    return await orderRepository.getAllOrders(page, limit, search);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserTotalOrder = async (userId, time) => {
  try {
    let startDate, endDate;
    const now = new Date();

    if (time === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    } else if (time === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (time === "day") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
    } else {
      throw new Error('Invalid time parameter. Use "day", "month", or "year".');
    }

    // Truy vấn đơn hàng theo thời gian và userId
    const orders = await orderRepository.findOrdersByTimeRange(
      userId,
      startDate,
      endDate
    );

    // Tổng số đơn hàng
    const totalOrders = orders.length;

    // Tổng số sản phẩm đã đặt
    const totalProducts = orders.reduce(
      (sum, order) => sum + order.totalItems,
      0
    );

    // Tổng số tiền đã mua
    const totalAmountSpent = orders.reduce(
      (sum, order) => sum + order.finalTotal,
      0
    );

    return {
      totalOrders,
      totalProducts,
      totalAmountSpent,
    };
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getProductCheckout = async (userId) => {
  try {
    const cart = await orderRepository.findCartCheckoutItems(userId);

    // Nếu không có sản phẩm nào, trả về giỏ hàng rỗng
    if (!cart.length) {
      return {
        message: "No checked-out items found",
        products: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    return {
      message: "Checked-out items retrieved successfully",
      products: cart[0].products,
      totalItems: cart[0].totalItems,
      totalPrice: cart[0].totalPrice,
    };
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    return await orderRepository.getOrderById(orderId);
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateOrderState = async (orderId, state) => {
  try {
    return await orderRepository.updateOrderState(orderId, state);
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateOrderDeliveryState = async (orderId, deliveryState) => {
  try {
    return await orderRepository.updateOrderDeliveryState(
      orderId,
      deliveryState
    );
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getRecentOrders = async (limit) => {
  try {
    const orders = await orderRepository.getRecentOrders(limit);
    return orders;
  } catch (error) {
    throw error;
  }
};

export const orderService = {
  getProductCheckout,
  createOrder,
  getUserTotalOrder,
  getUserOrder,
  getAllOrders,
  getOrderById,
  updateOrderState,
  updateOrderDeliveryState,
  getRecentOrders,
};
