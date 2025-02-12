import mongoose from "mongoose";
import CartModel from "../models/cartModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/productModel.js";

const validateVariation = (newProduct, variations) => {
  const { type, quantity } = variations[0]; // Lấy thông tin variation từ tham số `variations`

  // Tách type để tạo miniVar
  const miniVar = type.split(", ");

  // Lấy danh sách các variation của sản phẩm
  const productVar = newProduct?.variations?.pricing;

  // Tìm kiếm variation khớp với giá trị miniVar
  const matchingProduct = productVar.find((item) =>
    miniVar.every((val) => Object.values(item).includes(val))
  );

  // Nếu không tìm thấy matchingProduct, ném lỗi
  if (!matchingProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found in the product variations`
    );
  }

  // Kiểm tra số lượng tồn kho
  if (quantity > matchingProduct?.stock) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Product out of stock`);
  }

  // Trả về sản phẩm phù hợp
  return matchingProduct;
};

const addToCart = async (userId, products = {}) => {
  const userCart = await CartModel.findOne({ userId });

  // Kiểm tra nếu giỏ hàng của người dùng không tồn tại
  if (!userCart) {
    return await createCart(userId, products);
  }

  // Kiểm tra nếu giỏ hàng rỗng
  if (!userCart.products.length) {
    const newProduct = await ProductModel.findById(products[0].productId);

    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${products[0].productId}`
      );
    }

    // Nếu không có pricing hoặc validate thành công, thêm sản phẩm vào giỏ hàng
    userCart.products = [products[0]];
    return await userCart.save();
  }

  // Nếu giỏ hàng không rỗng, gọi hàm cập nhật số lượng sản phẩm trong giỏ hàng
  return await updateUserCartQuantity(userId, products);
};

const updateUserCartQuantity = async (userId, product = []) => {
  const { productId, variations = [] } = product[0];

  // Kiểm tra sản phẩm trong cơ sở dữ liệu
  const newProduct = await ProductModel.findById(productId);
  if (!newProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found with id: ${productId}`
    );
  }

  // Tìm giỏ hàng của người dùng
  const userCart = await CartModel.findOne({ userId, state: "ACTIVE" });

  // Tìm sản phẩm trong giỏ hàng
  const existingProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
    // Kiểm tra nếu variation.type đã có trong sản phẩm
    const existingVariation = existingProduct.variations.find(
      (varItem) => varItem.type === variations[0].type
    );

    if (existingVariation) {
      // Nếu variation đã tồn tại, cập nhật số lượng mới thay vì cộng
      existingVariation.quantity = variations[0].quantity; // Cập nhật số lượng mới
    } else {
      // Nếu variation chưa tồn tại, kiểm tra variation.pricing
      if (newProduct.variations?.pricing?.length > 0) {
        // Nếu có pricing, validate variation trước khi thêm
        validateVariation(newProduct, variations);
      }
      existingProduct.variations.push(...variations);
    }

    // Lưu lại giỏ hàng sau khi cập nhật số lượng hoặc thêm variation
    await userCart.save();
    return userCart;
  } else {
    // Nếu chưa có sản phẩm trong giỏ hàng, thêm mới vào giỏ hàng
    await CartModel.findOneAndUpdate(
      { userId, state: "ACTIVE" },
      { $addToSet: { products: product[0] } },
      { new: true, upsert: true }
    );
    return userCart;
  }
};

const createCart = async (userId, products = {}) => {
  try {
    const { productId, variations } = products[0];

    const newProduct = await ProductModel.findById(productId);

    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${productId}`
      );
    }

    // Kiểm tra nếu variation.pricing không rỗng
    if (newProduct.variations?.pricing?.length > 0) {
      // Nếu có pricing, validate variation trước khi thêm sản phẩm
      validateVariation(newProduct, variations);
    }

    // Tạo giỏ hàng mới
    const newCart = new CartModel({ userId, products: [products[0]] });

    return await newCart.save();
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (userId, product = {}) => {
  const { productId, variations = [] } = product;

  try {
    // Tìm cart của user đang ACTIVE
    const userCart = await CartModel.findOne({
      userId,
      state: "ACTIVE",
    });

    if (!userCart) {
      throw new Error("Cart not found.");
    }

    // Tìm sản phẩm trong giỏ hàng
    const existingProduct = userCart.products.find(
      (prod) => prod.productId.toString() === productId.toString()
    );

    if (!existingProduct) {
      throw new Error("Product not found in cart.");
    }

    // Kiểm tra và xóa từng variation
    variations.forEach((variationToRemove) => {
      const indexToRemove = existingProduct.variations.findIndex(
        (varItem) => varItem.type === variationToRemove.type
      );

      if (indexToRemove !== -1) {
        existingProduct.variations.splice(indexToRemove, 1);
      }
    });

    // Nếu không còn variation nào, xóa luôn productId khỏi giỏ hàng
    if (existingProduct.variations.length === 0) {
      userCart.products = userCart.products.filter(
        (prod) => prod.productId.toString() !== productId.toString()
      );
    }

    await userCart.save();
    return userCart;
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

      // Calculate the total price for each product
      const productTotalPrice = finalPrice * product.cartQuantity;
      totalPrice += productTotalPrice; // Add the product's total price to the overall total price

      return {
        ...product,
        finalPrice, // Giá cuối cùng của sản phẩm
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
