import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../utils/api.error.js";
import { productRepository } from "../repositories/product.repository.js";

const createProduct = async (data) => {
  try {
    const existingProduct = await productRepository.findProductByName(
      data.name
    );

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Product with name "${data.name}" already exists`
      );
    }

    const type = await productRepository.findCategoryBySlug(data.category);

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

const updateProduct = async (id, data) => {
  try {
    data = data.updatedFormData;

    const type = await productRepository.findCategoryBySlug(data.type);
    data.type = type._id;

    const product = await productRepository.updateProduct(id, data);
    return product;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const deleteProduct = async (id) => {
  try {
    const products = await productRepository.deleteProduct(id);
    if (!products) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Fail to delete`);
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Error deleting product`);
  }
};

const deleteManyProducts = async (_id) => {
  if (!_id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "products not found");
  }

  const response = await productRepository.deleteManyProducts(_id);

  if (!response) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete products"
    );
  }
  return { message: `Products deleted successfully` };
};

const getProductBySlug = async (slug) => {
  try {
    return await productRepository.getProductBySlug(slug);
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    return await productRepository.getProductById(id);
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async (req, res) => {
  try {
    return await productRepository.getAllProducts();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPageProducts = async (
  page,
  limit,
  category,
  search,
  sort,
  minPrice,
  maxPrice,
  rating
) => {
  try {
    return await productRepository.getPageProducts(
      page,
      limit,
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      rating
    );
  } catch (error) {
    console.error("Error in getPageProducts:", error);
    throw error;
  }
};

const getTopSoldProducts = async () => {
  try {
    return await productRepository.getTopSoldProducts();
  } catch (error) {
    console.error("Error in getTopSoldProducts:", error);
    throw error;
  }
};

const getProductWithBreadcrumbById = async (productId) => {
  try {
    return await productRepository.getProductWithBreadcrumbById(productId);
  } catch (error) {
    console.error("Error in getProductWithBreadcrumbById:", error);
    throw error;
  }
};

export const productService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPageProducts,
  deleteManyProducts,
  getProductBySlug,
  getProductById,
  getTopSoldProducts,
  getProductWithBreadcrumbById,
};
