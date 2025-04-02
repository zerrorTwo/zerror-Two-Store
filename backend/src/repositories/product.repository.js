import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import { categoryRepository } from "./category.repository.js";

// Tìm sản phẩm theo tên
const findProductByName = async (name) => {
  return await ProductModel.findOne({ name });
};

// Tìm danh mục theo slug
const findCategoryBySlug = async (slug) => {
  return await CategoryModel.findOne({ slug });
};

// Tạo sản phẩm mới
const createProduct = async (data) => {
  return await ProductModel.create(data);
};

// Cập nhật sản phẩm
const updateProduct = async (id, data) => {
  return await ProductModel.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// Xóa sản phẩm theo ID
const deleteProduct = async (id) => {
  return await ProductModel.deleteOne({ _id: id });
};

// Xóa nhiều sản phẩm
const deleteManyProducts = async (ids) => {
  return await ProductModel.deleteMany({ _id: ids });
};

// Lấy breadcrumb của danh mục
const getCategoryBreadcrumb = async (categorySlug) => {
  const category = await CategoryModel.findOne({ slug: categorySlug });
  if (!category) return null;

  const breadcrumb = [category.name];
  let parentCategory = category.parent;

  while (parentCategory) {
    const parent = await CategoryModel.findById(parentCategory);
    if (parent) {
      breadcrumb.unshift(parent.name);
      parentCategory = parent.parent;
    } else {
      break;
    }
  }

  return breadcrumb;
};

// Lấy sản phẩm theo slug
const getProductBySlug = async (slug) => {
  const productPipeline = [
    { $match: { slug } },
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
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
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

  const productResult = await ProductModel.aggregate(productPipeline);
  if (productResult.length === 0) return null;

  const currentProduct = productResult[0];
  const categoryBreadcrumb = await getCategoryBreadcrumb(
    currentProduct.categorySlug
  );

  return { ...currentProduct, categoryBreadcrumb };
};

// Lấy sản phẩm theo ID
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

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  return await ProductModel.find({}).populate("type", "name").exec();
};

// Lấy sản phẩm có phân trang
const getPageProducts = async (
  page = 1,
  limit = 10,
  category,
  search,
  sort,
  minPrice, // Thêm tham số minPrice
  maxPrice, // Thêm tham số maxPrice
  rating // Thêm tham số rating
) => {
  try {
    // Validate input parameters
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, Math.min(30, parseInt(limit)));
    minPrice = minPrice ? parseFloat(minPrice) : undefined; // Chuyển thành số, nếu không có thì undefined
    maxPrice = maxPrice ? parseFloat(maxPrice) : undefined; // Chuyển thành số, nếu không có thì undefined
    rating = rating ? parseFloat(rating) : undefined; // Chuyển thành số, nếu không có thì undefined

    // Xử lý category filter
    let categoryFilter = {};
    if (category) {
      const currentCategory = await CategoryModel.findOne({
        slug: category,
      }).lean();
      if (!currentCategory) {
        return {
          page,
          limit,
          totalPages: 0,
          totalProducts: 0,
          products: [],
          message: "Category not found",
        };
      }
      categoryFilter = { type: currentCategory._id };
    }

    // Xử lý search filter
    const searchFilter = search
      ? { name: { $regex: new RegExp(search, "i") } }
      : {};

    // Kết hợp filters cơ bản
    const filters = {
      ...categoryFilter,
      ...searchFilter,
      status: true,
    };

    // Tính skip và chuẩn bị sort
    const skip = (page - 1) * limit;
    const sortStage = {
      "sold-desc": { totalSold: -1 },
      "price-asc": { minPrice: 1 },
      "price-desc": { minPrice: -1 },
      "created-desc": { createdAt: -1 },
    }[sort] || { createdAt: -1 };

    // Pipeline tối ưu
    const productsPipeline = [
      { $match: filters }, // Filter cơ bản
      {
        $addFields: {
          normalizedPricing: {
            $cond: [
              { $isArray: "$variations.pricing" },
              "$variations.pricing",
              {
                $cond: [
                  { $eq: [{ $type: "$variations.pricing" }, "object"] },
                  [{ $ifNull: ["$variations.pricing", {}] }],
                  [],
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          minPrice: {
            $cond: [
              { $gt: [{ $size: { $ifNull: ["$normalizedPricing", []] } }, 0] },
              { $min: "$normalizedPricing.price" },
              "$price",
            ],
          },
          totalStock: { $sum: { $ifNull: ["$normalizedPricing.stock", [0]] } },
          totalSold: { $sum: { $ifNull: ["$normalizedPricing.sold", [0]] } },
        },
      },
      // Thêm filter cho minPrice, maxPrice và rating
      {
        $match: {
          ...(minPrice !== undefined ? { minPrice: { $gte: minPrice } } : {}),
          ...(maxPrice !== undefined ? { minPrice: { $lte: maxPrice } } : {}),
          ...(rating !== undefined ? { rating: { $gte: rating } } : {}),
        },
      },
      {
        $facet: {
          products: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                localField: "type",
                foreignField: "_id",
                as: "typeInfo",
              },
            },
            {
              $unwind: { path: "$typeInfo", preserveNullAndEmptyArrays: true },
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
                rating: 1,
                numReviews: 1,
                type: "$typeInfo.name",
                status: 1,
                createdAt: 1,
                tag: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ];

    // Thực hiện aggregate và lấy kết quả
    const [result] = await ProductModel.aggregate(productsPipeline).exec();
    const totalProducts = result.total[0]?.count || 0;
    const products = result.products || [];

    return {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    };
  } catch (error) {
    console.error("Error in getPageProducts:", error);
    throw new Error("Failed to fetch products");
  }
};

// Lấy sản phẩm bán chạy nhất
const getTopSoldProducts = async () => {
  return await ProductModel.aggregate([
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
    { $sort: { totalSold: -1 } },
    { $limit: 20 },
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
};

const findProductsByIds = async (ids) => {
  try {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    return await ProductModel.aggregate([
      { $match: { _id: { $in: objectIds } } },
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
    ]);
  } catch (error) {
    throw error;
  }
};

// Tìm sản phẩm theo danh sách ID
const findProductIdByIds = async (ids) => {
  return await ProductModel.find({ _id: { $in: ids } }); // Không dùng .lean()
};

// Hàm xây dựng breadcrumb từ categoryId
const buildBreadcrumbFromCategory = async (categoryId) => {
  const breadcrumb = [];
  let currentCategoryId = categoryId;

  // Lần ngược từ danh mục hiện tại lên các danh mục cha
  while (currentCategoryId) {
    const category = await categoryRepository.findCategoryById(
      currentCategoryId
    );
    if (!category) break;

    breadcrumb.unshift({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    });

    currentCategoryId = category.parent; // Tiếp tục với danh mục cha
  }

  // Thêm "Home" vào đầu breadcrumb
  breadcrumb.unshift({
    id: "home",
    name: "Home",
    slug: "/",
  });

  return breadcrumb;
};

// Repository: Lấy sản phẩm và breadcrumb từ productId
const getProductWithBreadcrumbById = async (productId) => {
  try {
    // Kiểm tra productId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    // Tìm sản phẩm theo productId và populate trường type (Category)
    const product = await ProductModel.findById(productId)
      .select("name slug type")
      .populate({
        path: "type",
        select: "name slug parent",
      })
      .lean()
      .exec();

    if (!product) {
      throw new Error("Product not found");
    }

    // Xây dựng breadcrumb từ categoryId (type)
    const breadcrumb = await buildBreadcrumbFromCategory(product.type._id);

    // Thêm sản phẩm vào cuối breadcrumb
    breadcrumb.push({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
    });

    // Trả về cả sản phẩm và breadcrumb
    return breadcrumb;
  } catch (error) {
    console.error("Error in getProductWithBreadcrumbById:", error.message);
    throw error; // Ném lỗi để xử lý ở tầng trên (controller)
  }
};

export const productRepository = {
  findProductByName,
  findCategoryBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProducts,
  getCategoryBreadcrumb,
  getProductBySlug,
  getProductById,
  getAllProducts,
  getPageProducts,
  getTopSoldProducts,
  findProductsByIds,
  findProductIdByIds,
  getProductWithBreadcrumbById,
};
