import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";

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
const getPageProducts = async (page, limit, category, search, sort) => {
  let categoryFilter = {};
  if (category) {
    const currentCategory = await CategoryModel.findOne({ slug: category });
    if (currentCategory) {
      categoryFilter = { type: currentCategory._id };
    }
  }

  const searchFilter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};
  const filters = {
    ...categoryFilter,
    ...searchFilter,
    status: true,
  };

  const skip = (page - 1) * limit;
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
      sortStage = { createdAt: -1 };
  }

  const productsPipeline = [
    { $match: filters },
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
  ];

  const products = await ProductModel.aggregate(productsPipeline);
  const totalProducts = await ProductModel.countDocuments(filters);

  return {
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts,
    products,
  };
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
    return await ProductModel.aggregate([
      { $match: { _id: { $in: ids } } },
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
};
