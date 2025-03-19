import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../utils/api.error.js";
import {
  findProductByName,
  findCategoryBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  getProductBySlug,
  getProductById,
  getAllProducts,
  getPageProducts,
  getTopSoldProducts,
} from "../repositories/product.repository.js";

const createProductService = async (data) => {
  try {
    const existingProduct = await findProductByName(data.name);

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Product with name "${data.name}" already exists`
      );
    }

    const type = await findCategoryBySlug(data.category);

    if (!type) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Category ${data.type} not found`
      );
    }
    data.slug = slugify(data.name);
    data.type = type._id;
    if (data.variations && data.variations.pricing) {
      data.variations.pricing = data.variations.pricing.map((pricing) => ({
        ...pricing,
        sold: 0,
      }));
    }

    const newProduct = await createProduct(data);
    return newProduct;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const updateProductService = async (id, data) => {
  try {
    data = data.updatedFormData;

    const type = await findCategoryBySlug(data.type);
    data.type = type._id;

    const product = await updateProduct(id, data);
    return product;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const deleteProductService = async (id) => {
  try {
    const products = await deleteProduct(id);
    if (!products) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Fail to delete`);
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Error deleting product`);
  }
};

const deleteManyProductsService = async (_id) => {
  if (!_id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "products not found");
  }

  const response = await deleteManyProducts(_id);

  if (!response) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete products"
    );
  }
  return { message: `Products deleted successfully` };
};

const getProductBySlugService = async (slug) => {
  try {
    return await getProductBySlug(slug);
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    throw error;
  }
};

const getProductByIdService = async (id) => {
  try {
    return await getProductById(id);
  } catch (error) {
    throw error;
  }
};

const getAllProductsService = async (req, res) => {
  try {
    return await getAllProducts();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPageProductsService = async (page, limit, category, search, sort) => {
  try {
    return await getPageProducts(page, limit, category, search, sort);
  } catch (error) {
    console.error("Error in getPageProducts:", error);
    throw error;
  }
};

const getTopSoldProductsService = async () => {
  try {
    return await getTopSoldProducts();
  } catch (error) {
    console.error("Error in getTopSoldProducts:", error);
    throw error;
  }
};

export const productService = {
  getAllProducts: getAllProductsService,
  createProduct: createProductService,
  updateProduct: updateProductService,
  deleteProduct: deleteProductService,
  getPageProducts: getPageProductsService,
  deleteManyProducts: deleteManyProductsService,
  getProductBySlug: getProductBySlugService,
  getProductById: getProductByIdService,
  getTopSoldProducts: getTopSoldProductsService,
};
