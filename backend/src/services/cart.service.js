import ApiError from "../utils/api.error.js";
import { StatusCodes } from "http-status-codes";
import {
  findCartByUserId,
  findActiveCartByUserId,
  findProductById,
  createNewCart,
  updateCart,
  updateAllCheckoutStatus,
  findActiveCartWithAggregate,
  getCartSummary,
  getPaginatedCart,
} from "../repositories/cart.repository.js";

const validateVariation = (newProduct, variations) => {
  const { type, quantity } = variations[0];
  const typeStr = Object.values(type).join(", ");
  const miniVar = typeStr.split(", ");
  const productVar = newProduct?.variations?.pricing;

  const keyCount = Object.keys(newProduct?.variations)?.length;
  if (keyCount - 1 !== miniVar?.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Variation is not available!!`);
  }

  const matchingProduct = productVar.find((item) =>
    miniVar.every((val) => Object.values(item).includes(val))
  );

  if (!matchingProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found in the product variations!!`
    );
  }

  if (quantity > matchingProduct?.stock) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Product out of stock!!`);
  }

  matchingProduct.price = matchingProduct?.price || 0;
  return matchingProduct;
};

const addToCart = async (userId, products = []) => {
  const userCart = await findCartByUserId(userId);

  if (!userCart) {
    return await createCart(userId, products);
  }

  if (!userCart.products.length) {
    const newProduct = await findProductById(products[0].productId);

    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${products[0].productId}`
      );
    }

    if (newProduct?.variations?.pricing.length === 0) {
      products[0].variations[0].price = newProduct.price;
      userCart.products = [{ ...products[0] }];
    } else {
      const validProduct = validateVariation(
        newProduct,
        products[0].variations
      );
      products[0].variations[0].price = validProduct.price;
      userCart.products = [{ ...products[0] }];
    }

    return await userCart.save();
  }

  return await updateUserCartQuantity(userId, products);
};

const updateUserCartQuantity = async (userId, product = []) => {
  const { productId, variations = [] } = product[0];
  const isUpdate = variations[0]?.isUpdate;

  const newProduct = await findProductById(productId);
  if (!newProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found with id: ${productId}`
    );
  }

  const userCart = await findActiveCartByUserId(userId);

  if (!newProduct.variations?.pricing?.length) {
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
      product[0].variations[0].price = newProduct.price;
      product[0].variations[0].type = undefined;
      userCart.products.push(product[0]);
    }

    await userCart.save();
    return userCart;
  }

  const existingProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
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

      const validVariation = validateVariation(newProduct, variations);
      existingProduct.variations[existingVariationIndex].price =
        validVariation.price;
    } else {
      const validVariation = validateVariation(newProduct, variations);
      variations[0].price = validVariation.price;
      existingProduct.variations.push(...variations);
    }

    await userCart.save();
    return userCart;
  } else {
    const validProduct = validateVariation(newProduct, variations);

    if (!product[0].variations) {
      product[0].variations = [];
    }

    if (!product[0].variations[0]) {
      product[0].variations[0] = {};
    }

    product[0].variations[0].price = validProduct.price;

    await updateCart(userId, { $push: { products: product[0] } });
    return userCart;
  }
};

const updateUserCartVariation = async (userId, products = []) => {
  const userCart = await findCartByUserId(userId);

  if (!userCart) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Cart not found for this user.");
  }

  const { productId, variations = [] } = products[0];

  const newProduct = await findProductById(productId);
  if (!newProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found with id: ${productId}`
    );
  }

  const existingProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
    const existingVariationIndex = existingProduct.variations.findIndex(
      (varItem) =>
        JSON.stringify(Object.entries(varItem.type).sort()) ===
        JSON.stringify(Object.entries(variations[0].oldType).sort())
    );

    if (existingVariationIndex !== -1) {
      const newVariation = {
        ...existingProduct.variations[existingVariationIndex],
        type: variations[0].type,
      };

      const validVariation = validateVariation(newProduct, [newVariation]);

      if (!validVariation) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Invalid variation. Please check the product details."
        );
      }

      newVariation.price = validVariation.price;
      existingProduct.variations[existingVariationIndex] = newVariation;

      await userCart.save();
      return userCart;
    } else {
      throw new ApiError(StatusCodes.NOT_FOUND, "Old variation not found!");
    }
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found in cart!");
  }
};

const updateCheckout = async (userId, product = []) => {
  if (!product.length) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product data is required.");
  }

  const { productId, variations = [] } = product[0];

  if (variations.length > 0 && typeof variations[0] !== "object") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid variations format.");
  }

  const isUpdate = variations[0]?.isUpdate;

  const newProduct = await findProductById(productId);
  if (!newProduct) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product not found with id: ${productId}`
    );
  }

  let userCart = await findActiveCartByUserId(userId);

  if (!userCart) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User cart not found.");
  }

  if (!newProduct.variations?.pricing?.length) {
    const existingProduct = userCart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product not found in cart.");
    }

    if (existingProduct.variations.length > 0) {
      existingProduct.variations[0].checkout =
        !existingProduct.variations[0].checkout;
    } else {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No variations found for this product."
      );
    }

    await userCart.save();
    return userCart;
  }

  const existingProduct = userCart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
    const existingVariationIndex = existingProduct.variations.findIndex(
      (varItem) =>
        JSON.stringify(Object.entries(varItem.type).sort()) ===
        JSON.stringify(Object.entries(variations[0].type).sort())
    );

    if (existingVariationIndex !== -1) {
      existingProduct.variations[existingVariationIndex].checkout =
        !existingProduct.variations[existingVariationIndex].checkout;
    } else {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Variation not found for this product."
      );
    }

    await userCart.save();
    return userCart;
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found in cart.");
  }
};

const updateAllCheckout = async (userId, newState) => {
  if (typeof newState !== "boolean") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "newState must be true or false"
    );
  }

  await updateAllCheckoutStatus(userId, newState);
  return await findActiveCartByUserId(userId);
};

const createCart = async (userId, products = []) => {
  try {
    const { productId, variations } = products[0];

    const newProduct = await findProductById(productId);

    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${productId}`
      );
    }

    if (!newProduct.variations?.pricing?.length) {
      products[0].variations = [
        {
          price: newProduct.price,
          type: undefined,
        },
      ];
    } else {
      const validVariation = validateVariation(newProduct, variations);
      variations[0].price = validVariation.price;
    }

    const newCart = {
      userId,
      products: [products[0]],
    };

    return await createNewCart(newCart);
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (userId, products = {}) => {
  const { productId, variations = [] } = products[0];

  try {
    const userCart = await findActiveCartByUserId(userId);

    if (!userCart) {
      throw new Error("Cart not found.");
    }

    const existingProduct = userCart.products.find(
      (prod) => prod.productId.toString() === productId.toString()
    );

    if (!existingProduct) {
      throw new Error("Product not found in cart.");
    }

    const newProduct = await findProductById(productId);
    if (!newProduct) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Product not found with id: ${productId}`
      );
    }

    if (!newProduct.variations?.pricing?.length) {
      userCart.products = userCart.products.filter(
        (prod) => prod.productId.toString() !== productId.toString()
      );
    } else {
      variations.forEach((variationToRemove) => {
        const indexToRemove = existingProduct.variations.findIndex(
          (varItem) =>
            JSON.stringify(Object.entries(varItem.type || {}).sort()) ===
            JSON.stringify(Object.entries(variationToRemove.type || {}).sort())
        );

        if (indexToRemove !== -1) {
          existingProduct.variations.splice(indexToRemove, 1);
        }
      });

      if (existingProduct.variations.length === 0) {
        userCart.products = userCart.products.filter(
          (prod) => prod.productId.toString() !== productId.toString()
        );
      }
    }

    await userCart.save();
    return userCart;
  } catch (error) {
    throw error;
  }
};

const getRecentProducts = async (userId) => {
  try {
    const totalSummary = await getCartSummary(userId);
    const recentProducts = await findActiveCartWithAggregate(userId);

    if (!recentProducts.length) {
      return {
        message: "Cart is empty",
        products: [],
        totalItems: 0,
        totalVariations: 0,
        totalPrice: 0,
      };
    }

    const totalItems = totalSummary[0]?.totalItems || 0;
    const totalVariations = totalSummary[0]?.totalVariations || 0;
    const totalPrice = totalSummary[0]?.totalPrice || 0;

    return {
      message: "Cart summary retrieved successfully",
      products: recentProducts,
      totalItems,
      totalVariations,
      totalPrice,
    };
  } catch (error) {
    throw error;
  }
};

const getPageCart = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const cart = await getPaginatedCart(userId, skip, limit);

    if (!cart.length) {
      return {
        message: "Cart is empty",
        products: [],
        totalItems: 0,
        totalPrice: 0,
      };
    }

    let totalPrice = 0;
    const updatedProducts = cart[0].products.map((product) => {
      const productTotalPrice = product.cartVariations.reduce(
        (sum, variation) => {
          return sum + variation.price * variation.quantity;
        },
        0
      );

      totalPrice += productTotalPrice;

      return {
        ...product,
        productTotalPrice,
      };
    });

    const totalVariations = updatedProducts
      .map((item) => item.cartVariations.length)
      .reduce((acc, length) => acc + length, 0);

    return {
      message: "Cart summary retrieved successfully",
      products: updatedProducts,
      totalItems: updatedProducts?.length,
      totalVariations,
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
  updateUserCartVariation,
  updateCheckout,
  updateAllCheckout,
};
