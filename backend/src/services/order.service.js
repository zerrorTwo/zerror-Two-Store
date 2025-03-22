import mongoose from "mongoose";
import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import {
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
  getAllOrders,
  getOrderById,
  updateOrderDeliveryState,
  updateOrderState,
  getRecentOrders,
} from "../repositories/order.repository.js";

const createOrder = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, addressId, paymentMethod, notes } = data;

    // Kiểm tra địa chỉ giao hàng
    const address = await findAddressById(addressId, userId, session);
    if (!address)
      throw new ApiError(StatusCodes.NOT_FOUND, "Address not found!");

    // Lấy sản phẩm đã checkout từ giỏ hàng
    const cartItems = await findCartItemsByUserId(userId, session);

    // Kiểm tra nếu giỏ hàng rỗng
    if (!cartItems.length)
      throw new ApiError(StatusCodes.NOT_FOUND, "Cart is empty!");

    const { products, totalItems, totalPrice } = cartItems[0];

    // Kiểm tra sản phẩm có đầy đủ thông tin không
    for (const item of products) {
      if (!item.variation.price) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Product ${item.productId} is missing price!`
        );
      }
      if (!item.variation.quantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Product ${item.productId} is missing quantity!`
        );
      }
    }

    // Kiểm tra stock & trừ stock trong một lần truy vấn
    const productIds = products.map((item) => item.productId);
    const productList = await findProductsByIds(productIds, session);

    // Tạo map để kiểm tra stock nhanh hơn
    const productStockMap = new Map(
      productList.map((p) => [p._id.toString(), p])
    );

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

    // Cập nhật stock trong một lần thay vì từng sản phẩm riêng lẻ
    await Promise.all(productList.map((p) => p.save({ session })));

    // Tạo đơn hàng nháp
    const newOrder = await createNewOrder(
      {
        userId,
        products: products.map((p) => ({
          productId: p.productId,
          variations: [p.variation],
        })),
        addressId,
        paymentMethod,
        notes,
        totalItems,
        totalPrice,
        finalTotal: totalPrice + 30000,
      },
      session
    );

    // Cập nhật giỏ hàng sau khi tạo đơn hàng
    await updateCartAfterOrder(userId, session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Order created successfully",
      order: newOrder[0],
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getUserOrder = async (userId, page = 1, limit = 2, filter) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 2;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    // Bước 1: Phân trang trước khi lấy sản phẩm
    const paginatedOrders = await findPaginatedOrders(
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
    const orders = await findOrdersWithDetails(orderIds);

    // Kiểm tra còn dữ liệu không
    const totalOrders = await countUserOrders(userId);

    return {
      orders,
      hasMore: page * limit < totalOrders,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllOrdersService = async (page, limit, search) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  try {
    return await getAllOrders(page, limit, search);
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
    const orders = await findOrdersByTimeRange(userId, startDate, endDate);

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
    const cart = await findCartCheckoutItems(userId);

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

const getOrderByIdService = async (orderId) => {
  try {
    return await getOrderById(orderId);
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateOrderStateService = async (orderId, state) => {
  try {
    return await updateOrderState(orderId, state);
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateOrderDeliveryStateService = async (orderId, deliveryState) => {
  try {
    return await updateOrderDeliveryState(orderId, deliveryState);
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getRecentOrdersService = async (limit) => {
  try {
    const orders = await getRecentOrders(limit);
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
  getAllOrdersService,
  getOrderByIdService,
  updateOrderStateService,
  updateOrderDeliveryStateService,
  getRecentOrdersService,
};
