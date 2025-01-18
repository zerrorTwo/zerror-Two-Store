import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";

const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const existingProduct = await ProductModel.findOne({ name: data.name });

    if (existingProduct) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Product with name "${data.name}" already exists`
      );
    }

    const type = await CategoryModel.findOne({ name: data.type });

    if (!type) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Category ${data.type} not found`
      );
    }
    data.thumb = slugify(data.name);
    data.type = type._id;
    // console.log(data);

    const newProduct = await ProductModel.create(data);
    return newProduct;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;
    const type = await CategoryModel.findOne({
      name: data.updatedFormData.type,
    });
    data.updatedFormData.type = type._id;

    const product = await ProductModel.findByIdAndUpdate(
      id,
      data.updatedFormData,
      {
        new: true,
      }
    );
    return product;
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating product: ${error.message}`
    );
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await ProductModel.deleteOne({ _id: id });
    if (!products) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Fail to delete`);
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Error deleting product`);
  }
};

const deleteManyProducts = async (req, res) => {
  const products = req.body;
  if (!products) {
    throw new ApiError(StatusCodes.NOT_FOUND, "products not found");
  }
  const respone = await ProductModel.deleteMany(products);

  if (!respone) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete products"
    );
  }
  return { message: `Products deleted successfully` };
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("type", "name") // Tham chiếu đến 'type' và chỉ lấy trường 'name'
      .exec(); // Thực hiện truy vấn
    return products;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPageProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang

    // Tính số sản phẩm cần skip
    const skip = (page - 1) * limit;

    // Lấy danh sách sản phẩm từ database với phân trang
    const products = await ProductModel.find({})
      .skip(skip)
      .limit(limit)
      .populate("type", "name"); // Thay thế _id của type bằng name từ CategoryModel

    // Tính tổng số sản phẩm
    const totalProducts = await ProductModel.countDocuments({});

    // Tạo response với dữ liệu phân trang
    return {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    };
  } catch (error) {
    throw error;
  }
};

const getProductsByCategory = async (type) => {
  const products = await ProductModel.find({ type });
  return products;
};

export const productService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getPageProducts,
  deleteManyProducts,
  getProductsByCategory,
};
