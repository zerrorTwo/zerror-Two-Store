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

    if (newProduct?.variations?.pricing.length === 0) {
      userCart.products = [
        {
          ...products[0], // Lưu tất cả thông tin sản phẩm
          price: newProduct.price, // Thêm giá vào sản phẩm
        },
      ];
    } else {
      const validProduct = validateVariation(
        newProduct,
        products[0].variations
      );
      // Gán giá trị price vào variations[0]
      products[0].variations[0].price = validProduct.price;

      userCart.products = [
        {
          ...products[0],
        },
      ];
    }

    // Kiểm tra và cập nhật giá trong pricing

    // Nếu không có pricing hoặc validate thành công, thêm sản phẩm vào giỏ hàng

    return await userCart.save();
  }

  // Nếu giỏ hàng không rỗng, gọi hàm cập nhật số lượng sản phẩm trong giỏ hàng
  return await updateUserCartQuantity(userId, products);
};

const updateUserCartQuantity = async (userId, product = []) => {
  const { productId, variations = [] } = product[0];
  // Lấy thông tin variation từ tham số `variations`
  const isUpdate = variations[0]?.isUpdate;

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
      if (isUpdate) {
        existingProduct.variations[0].quantity = variations[0].quantity;
      } else {
        existingProduct.variations[0].quantity += variations[0].quantity;
      }
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
      if (isUpdate) {
        existingProduct.variations[existingVariationIndex].quantity =
          variations[0].quantity;
      } else {
        existingProduct.variations[existingVariationIndex].quantity +=
          variations[0].quantity;
      }
      // Nếu variation đã tồn tại, cập nhật số lượng mới thay vì cộng

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
};
