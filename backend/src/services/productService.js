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

    const type = await CategoryModel.findOne({ slug: data.category });

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
    data = data.updatedFormData;

    const type = await CategoryModel.findOne({
      slug: data.type,
    });
    data.type = type._id;

    const product = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
    });

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

const deleteManyProducts = async (_id) => {
  if (!_id) {
    throw new ApiError(StatusCodes.NOT_FOUND, "products not found");
  }

  const respone = await ProductModel.deleteMany({ _id: _id });

  if (!respone) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete products"
    );
  }
  return { message: `Products deleted successfully` };
};

const getCategoryBreadcrumb = async (categorySlug) => {
  try {
    // Lấy danh mục hiện tại từ database, tìm bằng slug thay vì _id
    const category = await CategoryModel.findOne({ slug: categorySlug });

    // Kiểm tra xem danh mục có tồn tại không
    if (!category) {
      return null; // Nếu không tìm thấy danh mục
    }

    // Tạo breadcrumb, bắt đầu với danh mục hiện tại
    const breadcrumb = [category.name];

    // Kiểm tra xem có danh mục cha không, nếu có tiếp tục truy vấn
    let parentCategory = category.parent; // Truy vấn danh mục cha qua trường `parent`

    // Tiến hành lặp lại để tìm các danh mục cha
    while (parentCategory) {
      const parent = await CategoryModel.findById(parentCategory);
      if (parent) {
        breadcrumb.unshift(parent.name); // Thêm danh mục cha vào đầu danh sách breadcrumb
        parentCategory = parent.parent; // Cập nhật lại danh mục cha
      } else {
        break; // Nếu không tìm thấy danh mục cha thì dừng
      }
    }

    return breadcrumb; // Trả về breadcrumb
  } catch (error) {
    throw error;
  }
};

const getProductBySlug = async (slug) => {
  try {
    // Define the aggregation pipeline
    const productsPipeline = [
      {
        $match: {
          slug: slug, // Match product by slug
        },
      },
      {
        $addFields: {
          // Calculate the minimum price across variations
          minVariationPrice: {
            $reduce: {
              input: { $ifNull: ["$variations.pricing", []] },
              initialValue: null,
              in: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$$value", null] },
                      { $lt: ["$$this.price", "$$value"] },
                    ],
                  },
                  "$$this.price",
                  "$$value",
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          minPrice: {
            $cond: [
              { $ifNull: ["$minVariationPrice", false] },
              { $min: ["$price", "$minVariationPrice"] },
              "$price",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          slug: { $first: "$slug" },
          mainImg: { $first: "$mainImg" },
          img: { $first: "$img" },
          stock: { $first: "$stock" },
          sold: { $first: "$sold" },
          variations: { $first: "$variations" },
          minPrice: { $first: "$minPrice" },
          // Calculate total stock from variations if available
          totalStock: {
            $sum: {
              $cond: [
                {
                  $gt: [{ $size: { $ifNull: ["$variations.pricing", []] } }, 0], // Kiểm tra nếu mảng pricing có phần tử
                },
                "$variations.pricing.stock", // Nếu có giá trị trong mảng pricing, lấy stock của variations
                "$stock", // Nếu mảng pricing rỗng, lấy stock của sản phẩm chính
              ],
            },
          },

          // Calculate total sold from variations if available
          totalSold: {
            $sum: {
              $cond: [
                {
                  $gt: [{ $size: { $ifNull: ["$variations.pricing", []] } }, 0], // Kiểm tra nếu mảng pricing có phần tử
                },
                "$variations.pricing.sold", // Nếu có giá trị trong mảng pricing, lấy sold của variations
                "$sold", // Nếu mảng pricing rỗng, lấy sold của sản phẩm chính
              ],
            },
          },

          createdAt: { $first: "$createdAt" },
          type: { $first: "$type" },
          status: { $first: "$status" },
        },
      },
      {
        $lookup: {
          from: "categories", // Join with categories collection
          localField: "type", // Field in product
          foreignField: "_id", // Field in categories collection
          as: "type",
        },
      },
      {
        $unwind: {
          path: "$type", // Unwind the type array
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          mainImg: 1,
          img: 1,
          price: 1,
          stock: 1,
          sold: 1,
          variations: 1,
          totalSold: 1,
          minPrice: 1,
          totalStock: 1,
          type: "$type.name", // Extract type name
          categorySlug: "$type.slug", // Extract category slug (added this)
          status: 1,
          createdAt: 1,
        },
      },
    ];

    // Run the aggregation pipeline on the Product model
    const product = await ProductModel.aggregate(productsPipeline).exec();

    // If the product exists, return the product, otherwise return null
    if (product.length > 0) {
      const currentProduct = product[0]; // Get the first product from the array

      // Lấy breadcrumb của danh mục tương ứng
      const categoryBreadcrumb = await getCategoryBreadcrumb(
        currentProduct.categorySlug // Use the categorySlug here
      );

      // Trả về thông tin sản phẩm cùng với breadcrumb
      return {
        ...currentProduct,
        categoryBreadcrumb, // Thêm breadcrumb vào kết quả sản phẩm
      };
    } else {
      return null; // Return null if no product is found
    }
  } catch (error) {
    throw error; // Handle any errors
  }
};

const getProductById = async (id) => {
  try {
    const product = await ProductModel.findById(id)
      .populate({
        path: "type",
        select: "slug",
      })
      .lean();

    if (product && product.type) {
      product.type = product.type.slug;
    }

    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("type", "name") // Tham chiếu đến 'type' và chỉ lấy trường 'name'
      .exec(); // Thực hiện truy vấn
    return products;
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getPageProducts = async (page, limit, category, search, sort) => {
  try {
    const currentCategory = category
      ? await CategoryModel.findOne({ slug: category })
      : null;

    const categoryFilter = currentCategory
      ? { type: { $in: [currentCategory._id] } }
      : {};

    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const filters = { ...categoryFilter, ...searchFilter };

    const skip = (page - 1) * limit;

    // Tạo đối tượng sort theo yêu cầu
    let sortStage = {};

    switch (sort) {
      case "sold-desc":
        sortStage = { totalSold: -1 };
        break;
      case "price-asc":
        sortStage = { minPrice: 1 };
        break;
      case "price-desc":
        sortStage = { minPrice: -1 };
        break;
      case "created-desc":
        sortStage = { createdAt: -1 };
        break;
      default:
        // Nếu không có sort hợp lệ, bỏ qua giai đoạn $sort
        sortStage = null;
        break;
    }

    const productsPipeline = [
      { $match: filters },
      { $skip: skip },
      { $limit: limit },
      {
        $unwind: {
          path: "$variations.pricing",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          slug: { $first: "$slug" },
          mainImg: { $first: "$mainImg" },
          img: { $first: "$img" },
          stock: { $first: "$stock" },
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
          totalStock: {
            $sum: {
              $cond: [
                { $ifNull: ["$variations.pricing.stock", false] },
                "$variations.pricing.stock",
                "$stock",
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
          createdAt: { $first: "$createdAt" },
          type: { $first: "$type" },
          status: { $first: "$status" },
        },
      },
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
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          mainImg: 1,
          img: 1,
          price: 1,
          stock: 1,
          variations: 1,
          totalSold: 1,
          minPrice: 1,
          totalStock: 1,
          type: "$type.name",
          status: 1,
          createdAt: 1,
        },
      },
    ];

    // Thêm giai đoạn $sort nếu sortStage không phải là null
    if (sortStage) {
      productsPipeline.push({ $sort: sortStage });
    }

    const products = await ProductModel.aggregate(productsPipeline);

    const totalProducts = await ProductModel.countDocuments(filters);

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

const getTopSoldProducts = async () => {
  try {
    const products = await ProductModel.aggregate([
      {
        $unwind: {
          path: "$variations.pricing",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          slug: { $first: "$slug" },
          mainImg: { $first: "$mainImg" },
          img: { $first: "$img" },
          stock: { $first: "$stock" },
          sold: { $first: "$sold" },
          variations: { $first: "$variations" },
          totalSold: {
            $sum: {
              $cond: [
                { $ifNull: ["$variations.pricing.sold", 0] },
                "$variations.pricing.sold",
                "$sold",
              ],
            },
          },
        },
      },

      { $sort: { totalSold: -1 } },

      { $limit: 20 },

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

      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          mainImg: 1,
          img: 1,
          price: 1,
          stock: 1,
          variations: 1,
          totalSold: 1,
          type: "$type.name",
        },
      },
    ]);

    return products;
  } catch (error) {
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
};
