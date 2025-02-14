import mongoose from "mongoose";
import CartModel from "../models/cartModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/productModel.js";

const validateVariation = (newProduct, variations) => {
  const { type, quantity } = variations[0]; // Lấy thông tin variation từ tham số `variations`
  const typeStr = Object.values(type).join(", ");

  // Tách type để tạo miniVar
  const miniVar = typeStr.split(", ");

  // Lấy danh sách các variation của sản phẩm
  const productVar = newProduct?.variations?.pricing;

  const keyCount = Object.keys(newProduct?.variations)?.length;
  if (keyCount - 1 !== miniVar?.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Variation is not available!!`);
  }

  // Tìm kiếm variation khớp với giá trị miniVar
  const matchingProduct = productVar.find((item) =>
    miniVar.every((val) => Object.values(item).includes(val))
  );

  // Nếu không tìm thấy matchingProduct, ném lỗi
  if (!matchingProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found in the product variations!!`
    );
  }

  // Kiểm tra số lượng tồn kho
  if (quantity > matchingProduct?.stock) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Product out of stock!!`);
  }

  // Cập nhật giá vào matchingProduct
  matchingProduct.price = matchingProduct?.price || 0; // Đảm bảo giá không bị undefined

  // Trả về sản phẩm phù hợp
  return matchingProduct;
};

const addToCart = async (userId, products = []) => {
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

    // Kiểm tra và cập nhật giá trong pricing
    const validProduct = validateVariation(newProduct, products[0].variations);

    // Nếu không có pricing hoặc validate thành công, thêm sản phẩm vào giỏ hàng
    userCart.products = [
      {
        ...products[0], // Lưu tất cả thông tin sản phẩm
        price: validProduct.price, // Thêm giá vào sản phẩm
      },
    ];
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

  // Nếu không có variations.pricing hoặc là mảng rỗng
  if (!newProduct.variations?.pricing?.length) {
    // Tìm sản phẩm trong giỏ hàng mà không xét đến variations
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existingProduct) {
      // Nếu đã có sản phẩm trong giỏ, chỉ cần cộng dồn số lượng
      existingProduct.variations[0].quantity += variations[0].quantity;
    } else {
      // Nếu chưa có, thêm sản phẩm vào giỏ hàng
      product[0].variations[0].price = newProduct.price;
      product[0].variations[0].type = undefined; // Không cần type khi không có pricing

      userCart.products.push(product[0]);
    }

    // Lưu lại giỏ hàng
    await userCart.save();
    return userCart;
  }

  // Nếu có variations.pricing, tiếp tục xử lý như trước
  const existingProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
    // Kiểm tra nếu variation.type đã có trong sản phẩm (không phân biệt thứ tự)
    const existingVariationIndex = existingProduct.variations.findIndex(
      (varItem) =>
        JSON.stringify(Object.entries(varItem.type).sort()) ===
        JSON.stringify(Object.entries(variations[0].type).sort())
    );

    if (existingVariationIndex !== -1) {
      // Nếu variation đã tồn tại, cập nhật số lượng mới thay vì cộng
      existingProduct.variations[existingVariationIndex].quantity +=
        variations[0].quantity;

      // Cập nhật giá cho variation nếu có pricing mới
      const validVariation = validateVariation(newProduct, variations);
      existingProduct.variations[existingVariationIndex].price =
        validVariation.price; // Cập nhật giá từ pricing
    } else {
      // Nếu variation chưa tồn tại, kiểm tra variation.pricing
      const validVariation = validateVariation(newProduct, variations);
      variations[0].price = validVariation.price; // Gán giá vào variation mới

      existingProduct.variations.push(...variations); // Thêm variation mới vào sản phẩm
    }

    // Lưu lại giỏ hàng sau khi cập nhật số lượng hoặc thêm variation
    await userCart.save();
    return userCart;
  } else {
    // Nếu chưa có sản phẩm trong giỏ hàng, thêm mới vào giỏ hàng
    const validProduct = validateVariation(newProduct, variations);

    // Kiểm tra nếu variations chưa được khởi tạo, thì khởi tạo
    if (!product[0].variations) {
      product[0].variations = []; // Khởi tạo mảng variations nếu chưa có
    }

    // Kiểm tra nếu variations[0] chưa tồn tại, tạo mới và gán giá trị
    if (!product[0].variations[0]) {
      product[0].variations[0] = {}; // Tạo đối tượng cho variation[0]
    }

    product[0].variations[0].price = validProduct.price; // Cập nhật giá vào sản phẩm mới

    // Thêm sản phẩm vào giỏ hàng (nếu chưa có)
    await CartModel.findOneAndUpdate(
      { userId, state: "ACTIVE" },
      { $push: { products: product[0] } }, // Thêm sản phẩm vào giỏ
      { new: true, upsert: true }
    );

    return userCart;
  }
};

const createCart = async (userId, products = []) => {
  try {
    const { productId, variations } = products[0];

    // Kiểm tra sản phẩm trong cơ sở dữ liệu
    const newProduct = await ProductModel.findById(productId);

    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${productId}`
      );
    }

    // Kiểm tra nếu variations.pricing là mảng rỗng
    if (!newProduct.variations?.pricing?.length) {
      // Nếu không có pricing, lấy price từ product và không cần type của variation
      products[0].variations = [
        {
          price: newProduct.price, // Lấy giá từ product
          type: undefined, // Không cần type
        },
      ];
    } else {
      // Nếu có pricing, validate variation và cập nhật giá cho sản phẩm
      const validVariation = validateVariation(newProduct, variations);

      // Cập nhật giá vào variation
      variations[0].price = validVariation.price;
    }

    // Tạo giỏ hàng mới với sản phẩm đã có giá
    const newCart = new CartModel({
      userId,
      products: [products[0]],
    });

    // Lưu giỏ hàng vào cơ sở dữ liệu
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
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          state: "ACTIVE",
        },
      },

      // Unwind mảng products để mỗi sản phẩm là một phần tử riêng biệt
      { $unwind: "$products" },

      // Unwind mảng variations để xử lý từng variation riêng biệt
      { $unwind: "$products.variations" },

      // Lookup để lấy thông tin chi tiết từ Product collection
      {
        $lookup: {
          from: "products", // Tên collection sản phẩm
          localField: "products.productId", // Trường cần kết nối
          foreignField: "_id", // Trường của Product collection
          as: "productDetails", // Tên alias của thông tin sản phẩm trả về
        },
      },

      // Unwind kết quả từ lookup
      { $unwind: "$productDetails" },

      // Thêm trường thời gian tạo của sản phẩm
      {
        $addFields: {
          productCreatedAt: "$products.createdAt", // Gắn thời gian tạo của sản phẩm vào trường mới
          normalizedVariationType: {
            $arrayToObject: {
              // Chuyển các cặp key-value thành đối tượng
              $map: {
                input: { $objectToArray: "$products.variations.type" },
                as: "item",
                in: { k: "$$item.k", v: "$$item.v" },
              },
            },
          },
        },
      },

      // Lựa chọn các trường cần trả về từ giỏ hàng và sản phẩm
      {
        $project: {
          _id: 0,
          productId: "$products.productId",
          variationType: {
            // Đảm bảo `type` là object, ví dụ [{ size: "M", color: "Red" }]
            $map: {
              input: [
                {
                  $arrayToObject: {
                    $objectToArray: "$products.variations.type",
                  },
                },
              ],
              as: "type",
              in: "$$type",
            },
          },
          variationPrice: "$products.variations.price",
          variationQuantity: "$products.variations.quantity",
          productName: "$productDetails.name",
          productImages: "$productDetails.mainImg",
          productSlug: "$productDetails.slug",
          totalPrice: {
            $multiply: [
              "$products.variations.quantity",
              "$products.variations.price",
            ],
          },
          createdAt: 1, // Đảm bảo lấy trường createdAt từ giỏ hàng
          productCreatedAt: 1, // Thêm trường thời gian sản phẩm
        },
      },

      // Sắp xếp các sản phẩm theo thời gian tạo của sản phẩm (mới nhất lên đầu)
      { $sort: { productCreatedAt: -1 } },

      // Tính tổng số sản phẩm và tổng giá trị
      {
        $group: {
          _id: "$productId",
          productName: { $first: "$productName" },
          productImages: { $first: "$productImages" },
          productSlug: { $first: "$productSlug" },
          variations: {
            $push: {
              type: "$variationType", // Dùng variationType đã chuẩn hóa
              price: "$variationPrice",
              quantity: "$variationQuantity",
            },
          },
          totalItems: { $sum: "$variationQuantity" },
          totalPrice: { $sum: "$totalPrice" },
          createdAt: { $first: "$createdAt" }, // Lấy createdAt để sắp xếp sau này
        },
      },

      // Lấy 5 sản phẩm mới nhất
      { $limit: 5 },
    ]);

    if (!cart.length) {
      return {
        message: "Cart is empty",
        products: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    // Tính tổng số lượng và tổng giá trị của tất cả các sản phẩm
    const totalItems = cart?.length;
    const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);

    // Trả về kết quả
    return {
      message: "Cart summary retrieved successfully",
      products: cart,
      totalItems,
      totalPrice,
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
    // Now calculate final price for each product and compute total price
    let totalPrice = 0;
    const updatedProducts = cart[0].products.map((product) => {
      // Tính tổng giá của từng product dựa trên cartVariations
      const productTotalPrice = product.cartVariations.reduce(
        (sum, variation) => {
          return sum + variation.price * variation.quantity;
        },
        0
      );

      // Cộng dồn vào tổng giá của toàn bộ giỏ hàng
      totalPrice += productTotalPrice;

      return {
        ...product,
        productTotalPrice, // Tổng giá trị của sản phẩm này
      };
    });

    return {
      message: "Cart summary retrieved successfully",
      products: updatedProducts,
      totalItems: updatedProducts?.length,
      totalPrice: totalPrice,
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
