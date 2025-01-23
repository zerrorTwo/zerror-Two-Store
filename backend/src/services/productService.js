import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";

const createProduct = async (data) => {
  try {
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
    if (data.variations && data.variations.pricing) {
      data.variations.pricing = data.variations.pricing.map((pricing) => ({
        ...pricing,
        sold: 0,
      }));
    }

    const newProduct = await ProductModel.create(data);
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

const deleteProduct = async (id) => {
  try {
    const products = await ProductModel.deleteOne({ _id: id });
    if (!products) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Fail to delete`);
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Error deleting product`);
  }
};

const deleteManyProducts = async (id) => {
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

const getPageProducts = async (page, limit, category, search) => {
  try {
    // Lọc sản phẩm theo category
    const currentCategory = category
      ? await CategoryModel.findOne({ slug: category })
      : null;

    const categoryFilter = currentCategory
      ? { type: { $in: currentCategory._id.toString() } }
      : {};

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const filters = { ...categoryFilter, ...searchFilter };
    // Tính số sản phẩm cần skip
    const skip = (page - 1) * limit;

    // Lấy danh sách sản phẩm từ database với phân trang
    const products = await ProductModel.aggregate([
      // Giai đoạn 1: Áp dụng bộ lọc (filters)
      { $match: filters },

      // Giai đoạn 2: Phân trang (skip và limit)
      { $skip: skip },
      { $limit: limit },

      // Giai đoạn 3: Tách từng phần tử trong variations.pricing
      {
        $unwind: {
          path: "$variations.pricing",
          preserveNullAndEmptyArrays: true, // Giữ lại sản phẩm không có variations
        },
      },

      // Giai đoạn 4: Tính toán giá trị nhỏ nhất và tổng quantity
      {
        $group: {
          _id: "$_id", // Nhóm theo sản phẩm
          name: { $first: "$name" },
          price: { $first: "$price" },
          thumb: { $first: "$thumb" },
          mainImg: { $first: "$mainImg" },
          img: { $first: "$img" },
          price: { $first: "$price" },
          quantity: { $first: "$quantity" },
          sold: { $first: "$sold" },
          variations: { $first: "$variations" },
          minPrice: {
            $min: {
              $cond: [
                { $ifNull: ["$variations.pricing.price", false] },
                "$variations.pricing.price",
                "$price",
              ],
            },
          },
          totalQuantity: {
            $sum: {
              $cond: [
                { $ifNull: ["$variations.pricing.quantity", false] },
                "$variations.pricing.quantity",
                "$quantity",
              ],
            },
          },
          totalSold: {
            $sum: {
              $cond: [
                { $ifNull: ["$variations.pricing.sold", 0] },
                "$variations.pricing.sold",
                "$sold",
              ],
            },
          },
          type: { $first: "$type" },
          status: { $first: "$status" },
        },
      },

      // Giai đoạn 5: Liên kết với bảng Category
      {
        $lookup: {
          from: "categories",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      {
        $unwind: {
          path: "$type",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Giai đoạn 6: Chọn các trường cần thiết
      {
        $project: {
          _id: 1,
          name: 1,
          thumb: 1,
          mainImg: 1,
          img: 1,
          price: 1,
          quantity: 1,
          variations: 1,
          totalSold: 1,
          minPrice: 1,
          totalQuantity: 1,
          type: "$type.name", // Thay _id của Category bằng name
          status: 1,
        },
      },
    ]);

    // Tính tổng số sản phẩm
    const totalProducts = await ProductModel.countDocuments(filters);

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
