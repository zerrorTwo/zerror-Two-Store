import mongoose from "mongoose";
import CartModel from "../models/cartModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/productModel.js";

const addToCart = async (userId, products = {}) => {
  const userCart = await CartModel.findOne({ userId });

  if (!userCart) {
    return await createCart(userId, products);
  }

  // Nếu cart rỗng, thêm trực tiếp sản phẩm mới
  if (!userCart.products.length) {
    userCart.products = [products];
    return await userCart.save();
  }

  return await updateUserCartQuantity(userId, products);
};

const updateUserCartQuantity = async (userId, product = {}) => {
  const { productId, quantity, variations = [] } = product;

  const query = {
    userId,
    "products.productId": productId,
    "products.variations": { $all: variations },
    state: "ACTIVE",
  };

  const updateSet = {
    $inc: { "products.$.quantity": quantity },
  };

  const options = { new: true };

  // Cập nhật số lượng nếu sản phẩm đã tồn tại
  const updatedCart = await CartModel.findOneAndUpdate(
    query,
    updateSet,
    options
  );

  if (!updatedCart) {
    // Nếu chưa có sản phẩm, thêm mới vào giỏ
    return await CartModel.findOneAndUpdate(
      { userId, state: "ACTIVE" },
      { $addToSet: { products: product } },
      { new: true, upsert: true }
    );
  }

  return updatedCart;
};

const createCart = async (userId, products = {}) => {
  try {
    const newCart = new CartModel({
      userId,
      products: [...products],
    });

    return await newCart.save();
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (userId, product = {}) => {
  const { productId, variations = [] } = product;

  try {
    const query = {
      userId,
      state: "ACTIVE",
    };

    const update = {
      $pull: {
        products: {
          productId,
          variations: { $all: variations },
        },
      },
    };

    const updatedCart = await CartModel.findOneAndUpdate(query, update, {
      new: true,
    });

    if (!updatedCart) {
      throw new Error("Product not found or already removed.");
    }

    return updatedCart;
  } catch (error) {
    throw error;
  }
};

const getRecentProducts = async (userId) => {
  try {
    const cart = await CartModel.aggregate([
      // Lọc giỏ hàng theo userId và trạng thái ACTIVE
      { $match: { userId: mongoose.Types.ObjectId(userId), state: "ACTIVE" } },

      // Unwind mảng products để mỗi sản phẩm là một phần tử riêng biệt
      { $unwind: "$products" },

      // Lookup để lấy thông tin chi tiết từ Product collection
      {
        $lookup: {
          from: "products", // Tên collection sản phẩm
          localField: "products.productId", // Trường cần kết nối
          foreignField: "_id", // Trường của Product collection
          as: "productDetails", // Tên alias của thông tin sản phẩm trả về
        },
      },

      // Unwind kết quả từ lookup, giúp biến mỗi sản phẩm có thông tin chi tiết thành một object
      { $unwind: "$productDetails" },

      // Lựa chọn các trường cần trả về từ giỏ hàng và sản phẩm
      {
        $project: {
          _id: 0,
          productId: "$products.productId",
          quantity: "$products.quantity",
          price: "$products.price",
          variations: "$products.variations",
          productName: "$productDetails.name",
          productImages: "$productDetails.mainImg",
          productSlug: "$productDetails.slug",
        },
      },

      // Tính toán tổng số sản phẩm và tổng giá trị
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

      // Lấy 3 sản phẩm mới nhất (dựa trên thời gian thêm sản phẩm vào giỏ hàng)
      {
        $project: {
          products: { $slice: ["$products", 3] },
          totalItems: 1,
          totalPrice: 1,
        },
      },
    ]);

    if (!cart.length) {
      return {
        message: "Cart is empty",
        products: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    return {
      message: "Cart summary retrieved successfully",
      products: cart[0].products,
      totalItems: cart[0].totalItems,
      totalPrice: cart[0].totalPrice,
    };
  } catch (error) {
    throw error;
  }
};

const getPageCart = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit; // Tính toán số lượng sản phẩm cần bỏ qua

    const cart = await CartModel.aggregate([
      // Lọc giỏ hàng theo userId và trạng thái ACTIVE
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          state: "ACTIVE",
        },
      },

      // Unwind mảng products để mỗi sản phẩm là một phần tử riêng biệt
      { $unwind: "$products" },

      // Lookup để lấy thông tin chi tiết từ Product collection
      {
        $lookup: {
          from: "products", // Tên collection sản phẩm
          localField: "products.productId", // Trường cần kết nối
          foreignField: "_id", // Trường của Product collection
          as: "productDetails", // Tên alias của thông tin sản phẩm trả về
        },
      },

      // Unwind kết quả từ lookup, giúp biến mỗi sản phẩm có thông tin chi tiết thành một object
      { $unwind: "$productDetails" },

      // Lựa chọn tất cả các trường từ cả giỏ hàng và sản phẩm
      {
        $project: {
          _id: 0,
          productId: "$products.productId",
          cartQuantity: "$products.quantity", // Số lượng sản phẩm trong giỏ (đổi tên thành cartQuantity)
          cartVariations: "$products.variations", // Biến thể của sản phẩm trong giỏ (đổi tên thành cartVariations)
          productName: "$productDetails.name", // Tên sản phẩm
          productImages: "$productDetails.mainImg", // Ảnh chính của sản phẩm
          productSlug: "$productDetails.slug", // Slug của sản phẩm
          stock: "$productDetails.stock", // Số lượng sản phẩm trong kho
          sold: "$productDetails.sold", // Số lượng sản phẩm đã bán
          status: "$productDetails.status", // Trạng thái sản phẩm
          type: "$productDetails.type", // Loại sản phẩm (category)
          rating: "$productDetails.rating", // Đánh giá trung bình của sản phẩm
          productVariations: "$productDetails.variations", // Các biến thể sản phẩm
          pricing: "$productDetails.variations.pricing", // Thông tin giá của các biến thể
          price: "$productDetails.price", // Giá mặc định của sản phẩm
        },
      },

      // Tính toán tổng số sản phẩm và tổng giá trị
      {
        $group: {
          _id: null,
          products: { $push: "$$ROOT" }, // Lưu tất cả sản phẩm vào mảng
          totalItems: { $sum: "$products.quantity" }, // Tổng số sản phẩm
          totalPrice: {
            $sum: {
              $multiply: ["$products.quantity", "$products.price"], // Tổng giá trị
            },
          },
        },
      },

      // Lấy sản phẩm theo trang (sử dụng $skip và $limit)
      { $skip: skip }, // Bỏ qua các sản phẩm đã được lấy từ các trang trước
      { $limit: limit }, // Giới hạn số lượng sản phẩm trả về

      // Lấy ra thông tin tổng số sản phẩm và tổng giá trị
      {
        $project: {
          products: 1, // Trả về mảng sản phẩm
          totalItems: 1, // Trả về tổng số sản phẩm
          totalPrice: 1, // Trả về tổng giá trị
        },
      },
    ]);

    if (!cart.length) {
      return {
        message: "Cart is empty",
        products: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    // Now calculate final price for each product and compute total price
    let totalPrice = 0;
    const updatedProducts = cart[0].products.map((product) => {
      let finalPrice = product.price; // Mặc định là giá bình thường
      let availableStock = product.stock; // Mặc định là số lượng tổng trong kho

      if (product.pricing && product.pricing.length > 0) {
        // Tìm kiếm giá từ pricing dựa trên variations
        const matchingVariation = product.pricing.find((variant) => {
          return (
            variant.size === product.cartVariations.size &&
            variant.color === product.cartVariations.color
          );
        });
        if (matchingVariation) {
          finalPrice = matchingVariation.price; // Sử dụng giá từ pricing
          availableStock = matchingVariation.stock; // Lấy stock từ pricing
        }
      }

      // Kiểm tra số lượng trong giỏ so với stock
      const stockCheck =
        product.cartQuantity <= availableStock ? "In stock" : "Out of stock";

      // Calculate the total price for each product
      const productTotalPrice = finalPrice * product.cartQuantity;
      totalPrice += productTotalPrice; // Add the product's total price to the overall total price

      return {
        ...product,
        finalPrice, // Giá cuối cùng của sản phẩm
        availableStock, // Số lượng sản phẩm khả dụng
        stockCheck, // Kiểm tra số lượng sản phẩm có sẵn
        productTotalPrice, // Giá trị tổng của sản phẩm
      };
    });

    return {
      message: "Cart summary retrieved successfully",
      products: updatedProducts,
      totalItems: cart.length,
      totalPrice: totalPrice, // Return the calculated totalPrice based on finalPrice
    };
  } catch (error) {
    throw error;
  }
};

export const cartService = {
  addToCart,
  createCart,
  updateUserCartQuantity,
  removeProductFromCart,
  getRecentProducts,
  getPageCart,
};
