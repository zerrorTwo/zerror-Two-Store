import mongoose from "mongoose";
import CartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import AddressModel from "../models/addressModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { momoService } from "./momoService.js";

const createOrder = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, addressId, paymentMethod, notes } = data;

    // Kiểm tra địa chỉ giao hàng
    const address = await AddressModel.findOne({
      _id: addressId,
      userId,
    }).session(session);
    if (!address)
      throw new ApiError(StatusCodes.NOT_FOUND, "Address not found!");

    // Lấy sản phẩm đã checkout từ giỏ hàng
    const cartItems = await CartModel.aggregate([
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
            $sum: { $multiply: ["$variations.price", "$variations.quantity"] },
          },
        },
      },
    ]).session(session);

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
    const productList = await ProductModel.find({
      _id: { $in: productIds },
    }).session(session);

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
    const newOrder = await OrderModel.create(
      [
        {
          userId,
          products,
          addressId,
          paymentMethod,
          notes,
          totalItems,
          totalPrice,
          finalTotal: totalPrice + 30000,
          paymentStatus: paymentMethod === "MOMO" ? "UNPAID" : "PAID",
        },
      ],
      { session }
    );

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

    // Nếu thanh toán bằng MOMO, tạo link thanh toán
    // if (paymentMethod === "MOMO") {
    //   const orderId = newOrder[0]._id.toString();
    //   const paymentUrl = await momoService.createMomoPayment({
    //     orderId,
    //     amount: newOrder[0].finalTotal,
    //     orderInfo: "Thanh toán đơn hàng",
    //     redirectUrl: "http://localhost:5173/thanks",
    //     ipnUrl:
    //       process.env.MOMO_IPN_URL ||
    //       "http://localhost:5000/v1/api/payment/momo/callback",
    //     extraData: "",
    //   });

    //   newOrder[0].paymentUrl = paymentUrl;

    //   // Commit transaction và trả về link thanh toán
    //   await session.commitTransaction();
    //   session.endSession();
    //   return { success: true, message: "Redirect to MOMO", paymentUrl };
    // }

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

const getUserOrder = async (userId) => {
  try {
    const orders = await OrderModel.find({ userId })
      .populate("addressId", "fullName phoneNumber address")
      .sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
    const orders = await OrderModel.find({
      userId,
      createdAt: { $gte: startDate, $lt: endDate },
    })
      .select("finalTotal totalItems")
      .lean();

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
    const cart = await CartModel.aggregate([
      // Lọc giỏ hàng theo userId và trạng thái ACTIVE
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          state: "ACTIVE",
        },
      },

      // Unwind để tách từng sản phẩm trong giỏ hàng
      { $unwind: "$products" },

      // **Lọc các sản phẩm có ít nhất một biến thể có checkout: true**
      {
        $match: {
          "products.variations.checkout": true,
        },
      },

      // Lookup để lấy thông tin chi tiết sản phẩm từ collection products
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Unwind để lấy chi tiết sản phẩm từ lookup
      { $unwind: "$productDetails" },

      // **Chỉ giữ lại các biến thể có checkout = true**
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

      // Chỉ lấy sản phẩm nếu sau khi lọc vẫn còn biến thể hợp lệ
      {
        $match: {
          "products.variations": { $ne: [] },
        },
      },

      // Project để chọn các trường cần thiết
      {
        $project: {
          _id: 0,
          productId: "$products.productId",
          cartQuantity: "$products.quantity",
          cartVariations: "$products.variations", // Chỉ chứa các biến thể có checkout: true
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

      // Sắp xếp theo ngày thêm vào giỏ hàng mới nhất
      { $sort: { createdAt: -1 } },

      // Gom nhóm lại để tính tổng giá trị giỏ hàng
      {
        $group: {
          _id: null,
          products: { $push: "$$ROOT" },
          totalItems: { $sum: { $size: "$cartVariations" } }, // Tổng số biến thể được chọn
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

      // Chọn ra kết quả cuối cùng
      {
        $project: {
          products: 1,
          totalItems: 1,
          totalPrice: 1,
        },
      },
    ]);

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

export const orderService = {
  getProductCheckout,
  createOrder,
  getUserTotalOrder,
  getUserOrder,
};
