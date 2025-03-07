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
    const productPipeline = [
      { $match: { slug } },

      // Tính toán minPrice từ variations.pricing nếu có
      {
        $addFields: {
          minPrice: {
            $cond: {
              if: {
                $gt: [{ $size: { $ifNull: ["$variations.pricing", []] } }, 0],
              },
              then: { $min: "$variations.pricing.price" },
              else: "$price",
            },
          },
        },
      },

      // Tính tổng stock và tổng sold
      {
        $addFields: {
          totalStock: {
            $sum: {
              $cond: {
                if: {
                  $gt: [{ $size: { $ifNull: ["$variations.pricing", []] } }, 0],
                },
                then: "$variations.pricing.stock",
                else: "$stock",
              },
            },
          },
          totalSold: {
            $sum: {
              $cond: {
                if: {
                  $gt: [{ $size: { $ifNull: ["$variations.pricing", []] } }, 0],
                },
                then: "$variations.pricing.sold",
                else: "$sold",
              },
            },
          },
        },
      },

      // Kết hợp với danh mục sản phẩm
      {
        $lookup: {
          from: "categories",
          localField: "type",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Chỉ lấy các trường cần thiết
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
          totalStock: 1,
          totalSold: 1,
          minPrice: 1,
          type: "$category.name",
          categorySlug: "$category.slug",
          status: 1,
          createdAt: 1,
        },
      },
    ];

    // Thực hiện truy vấn
    const productResult = await ProductModel.aggregate(productPipeline);

    if (productResult.length === 0) return null;

    // Lấy breadcrumb của danh mục
    const currentProduct = productResult[0];
    const categoryBreadcrumb = await getCategoryBreadcrumb(
      currentProduct.categorySlug
    );

    return { ...currentProduct, categoryBreadcrumb };
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    throw error;
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
    // Xác định bộ lọc danh mục
    let categoryFilter = {};
    if (category) {
      const currentCategory = await CategoryModel.findOne({ slug: category });
      if (currentCategory) {
        categoryFilter = { type: currentCategory._id };
      }
    }

    // Xác định bộ lọc tìm kiếm
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Kết hợp các bộ lọc
    const filters = {
      ...categoryFilter,
      ...searchFilter,
      status: true, // Chỉ lấy sản phẩm đang hoạt động
    };

    // Tính toán skip cho phân trang
    const skip = (page - 1) * limit;

    // Xác định cách sắp xếp
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
        sortStage = { createdAt: -1 }; // Mặc định: mới nhất
        break;
    }

    // Pipeline cho aggregation
    const productsPipeline = [
      { $match: filters },

      // Chuẩn hóa pricing: Nếu là object thì chuyển thành mảng
      {
        $addFields: {
          normalizedPricing: {
            $cond: {
              if: { $isArray: "$variations.pricing" },
              then: "$variations.pricing",
              else: {
                $cond: {
                  if: { $eq: [{ $type: "$variations.pricing" }, "object"] },
                  then: [{ $ifNull: ["$variations.pricing", {}] }],
                  else: [],
                },
              },
            },
          },
        },
      },

      // Tính toán minPrice từ variations.pricing nếu có
      {
        $addFields: {
          minPrice: {
            $cond: {
              if: {
                $gt: [{ $size: { $ifNull: ["$normalizedPricing", []] } }, 0],
              },
              then: { $min: "$normalizedPricing.price" },
              else: "$price",
            },
          },
        },
      },

      // Tính toán tổng tồn kho và tổng số lượng đã bán
      {
        $addFields: {
          totalStock: {
            $sum: {
              $map: {
                input: "$normalizedPricing",
                as: "variant",
                in: { $ifNull: ["$$variant.stock", 0] },
              },
            },
          },
          totalSold: {
            $sum: {
              $map: {
                input: "$normalizedPricing",
                as: "variant",
                in: { $ifNull: ["$$variant.sold", 0] },
              },
            },
          },
        },
      },

      // Sắp xếp sau khi đã tính toán totalSold và minPrice
      { $sort: sortStage },

      // Phân trang sau khi đã sắp xếp
      { $skip: skip },
      { $limit: limit },

      // Lookup để lấy thông tin danh mục
      {
        $lookup: {
          from: "categories",
          localField: "type",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      {
        $unwind: {
          path: "$typeInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Project để chỉ lấy các trường cần thiết
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
          rating: 1,
          numReviews: 1,
          type: {
            _id: "$typeInfo._id",
            name: "$typeInfo.name",
            slug: "$typeInfo.slug",
          },
          status: 1,
          createdAt: 1,
          tag: 1,
        },
      },
    ];

    // Thực hiện truy vấn để lấy sản phẩm
    const products = await ProductModel.aggregate(productsPipeline);

    // Đếm tổng số sản phẩm phù hợp với điều kiện lọc
    const totalProducts = await ProductModel.countDocuments(filters);

    // Trả về kết quả bao gồm thông tin phân trang và danh sách sản phẩm
    return {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    };
  } catch (error) {
    console.error("Error in getPageProducts:", error);
    throw error;
  }
};

const getTopSoldProducts = async () => {
  try {
    const products = await ProductModel.aggregate([
      // Chuẩn hóa pricing: Nếu là object thì chuyển thành mảng
      {
        $addFields: {
          normalizedPricing: {
            $cond: {
              if: { $isArray: "$variations.pricing" },
              then: "$variations.pricing",
              else: {
                $cond: {
                  if: { $eq: [{ $type: "$variations.pricing" }, "object"] },
                  then: [{ $ifNull: ["$variations.pricing", {}] }],
                  else: [],
                },
              },
            },
          },
        },
      },

      // Tính minPrice và totalSold
      {
        $addFields: {
          minPrice: {
            $cond: {
              if: {
                $gt: [{ $size: { $ifNull: ["$normalizedPricing", []] } }, 0],
              },
              then: { $min: "$normalizedPricing.price" },
              else: "$price",
            },
          },
          totalSold: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: "$normalizedPricing",
                    as: "variant",
                    in: { $ifNull: ["$$variant.sold", 0] },
                  },
                },
              },
              "$sold",
            ],
          },
        },
      },

      // Sắp xếp theo `totalSold` giảm dần
      { $sort: { totalSold: -1 } },

      // Giới hạn 20 sản phẩm
      { $limit: 20 },

      // Lookup để lấy thông tin danh mục
      {
        $lookup: {
          from: "categories",
          localField: "type",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      {
        $unwind: {
          path: "$typeInfo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Chọn các trường cần thiết
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          mainImg: 1,
          img: 1,
          price: 1,
          minPrice: 1,
          stock: 1,
          variations: 1,
          totalSold: 1,
          type: {
            _id: "$typeInfo._id",
            name: "$typeInfo.name",
            slug: "$typeInfo.slug",
          },
        },
      },
    ]);

    return products;
  } catch (error) {
    console.error("Error in getTopSoldProducts:", error);
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
