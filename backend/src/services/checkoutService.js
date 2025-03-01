import mongoose from "mongoose";
import CartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import AddressModel from "../models/addressModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { momoService } from "./momoService.js";

const createOrder = async (userId, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { addressId, paymentMethod, notes } = data;

    // Kiểm tra địa chỉ giao hàng
    const address = await AddressModel.findOne({
      _id: addressId,
      userId,
    }).session(session);
    if (!address) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Address not found!");
    }

    // Lấy sản phẩm đã checkout
    const cartItems = await CartModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$products" },
      { $unwind: "$products.variations" },
      { $match: { "products.variations.checkout": true } },
      {
        $group: {
          _id: null,
          products: {
            $push: {
              productId: "$products.productId",
              variation: "$products.variations",
            },
          },
          totalItems: { $sum: "$products.variations.quantity" },
          totalPrice: {
            $sum: {
              $multiply: [
                "$products.variations.price",
                "$products.variations.quantity",
              ],
            },
          },
        },
      },
    ]).session(session);

    if (cartItems.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Cart is empty!");
    }

    const { products, totalItems, totalPrice } = cartItems[0];

    // Kiểm tra stock & trừ stock
    for (const item of products) {
      const product = await ProductModel.findOne({
        _id: item.productId,
      }).session(session);
      if (!product || product.stock < item.variation.quantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Not enough stock for product ${item.productId}`
        );
      }

      // Trừ stock
      product.stock -= item.variation.quantity;
      await product.save({ session });
    }

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

    // Nếu là thanh toán MOMO, gọi API tạo thanh toán MOMO
    if (paymentMethod === "MOMO") {
      const orderId = newOrder[0]._id.toString();
      const paymentUrl = await momoService.createMomoPayment({
        orderId,
        amount: newOrder[0].finalTotal,
        orderInfo: "Thanh toán đơn hàng",
        redirectUrl: "http://localhost:5173/thanks",
        ipnUrl:
          "https://d48c-112-197-30-44.ngrok-free.app/v1/api/payment/momo/callback",
        extraData: "",
      });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return { success: true, message: "Redirect to MOMO", paymentUrl };
    }

    // Nếu thanh toán COD, hoàn tất đơn hàng
    await CartModel.updateOne(
      { userId },
      { $pull: { "products.$[].variations": { checkout: true } } },
      { session }
    );

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

export const checkoutService = {
  getProductCheckout,
  createOrder,
};
