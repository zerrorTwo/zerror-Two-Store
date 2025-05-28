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

  // Khởi tạo breadcrumb với đối tượng của danh mục hiện tại
  const breadcrumb = [{ name: category.name, slug: category.slug }];
  let parentCategory = category.parent;

  while (parentCategory) {
    const parent = await CategoryModel.findById(parentCategory);
    if (parent) {
      // Thêm đối tượng của danh mục cha vào đầu mảng
      breadcrumb.unshift({ name: parent.name, slug: parent.slug });
      parentCategory = parent.parent;
    } else {
      // Dừng lại nếu không tìm thấy danh mục cha
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

const getCategoryHierarchy = async (categorySlug) => {
  // 1. Tìm danh mục hiện tại bằng slug
  const currentCategory = await CategoryModel.findOne({ slug: categorySlug });
  if (!currentCategory) {
    return {
      parents: [],
      current: null,
      children: []
    };
  }

  // 2. Lấy danh sách danh mục cha (breadcrumb)
  const parents = [];
  let parentCategoryRef = currentCategory.parent; // Tham chiếu đến _id của danh mục cha

  while (parentCategoryRef) {
    const parent = await CategoryModel.findById(parentCategoryRef);
    if (parent) {
      // Đảm bảo chỉ lấy name, slug, và _id của danh mục cha
      parents.unshift({ name: parent.name, slug: parent.slug, _id: parent._id });
      parentCategoryRef = parent.parent;
    } else {
      break; // Dừng nếu không tìm thấy danh mục cha
    }
  }

  // 3. Lấy danh sách danh mục con trực tiếp
  const children = [];
  if (currentCategory.children && currentCategory.children.length > 0) {
    // Lấy thông tin chi tiết của các danh mục con từ _id trong mảng children
    // và chỉ chọn các trường name, slug
    const childCategories = await CategoryModel.find(
      { _id: { $in: currentCategory.children } },
      'name slug' // Chỉ lấy trường 'name' và 'slug'
    );
    childCategories.forEach(child => {
      children.push({ name: child.name, slug: child.slug, _id: child._id }); // Thêm _id nếu bạn cần nó cho các thao tác khác
    });
  }
  const result = {
    parents: parents,
    current: { name: currentCategory.name, slug: currentCategory.slug, _id: currentCategory._id },
    children: children
  }
  // 4. Trả về kết quả
  return result
};
// Lấy sản phẩm có phân trang
const getPageProducts = async (
  page = 1,
  limit = 10,
  category,
  search,
  sort,
  minPrice,
  maxPrice,
  rating
) => {
  try {
    // Validate input parameters
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, Math.min(30, parseInt(limit)));
    minPrice = minPrice ? parseFloat(minPrice) : undefined;
    maxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    rating = rating ? parseFloat(rating) : undefined;

    // Xử lý category filter
    let categoryFilter = {};
    if (category) {
      // Tìm danh mục theo slug
      const currentCategory = await CategoryModel.findOne({ slug: category });
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

      // Sử dụng $graphLookup để lấy tất cả danh mục con
      const categoryIds = await CategoryModel.aggregate([
        { $match: { _id: currentCategory._id } },
        {
          $graphLookup: {
            from: "categories",
            startWith: "$_id", // Bắt đầu từ _id của danh mục hiện tại
            connectFromField: "children",
            connectToField: "_id",
            as: "descendants",
          },
        },
        {
          $project: {
            allIds: {
              $concatArrays: [
                ["$_id"], // Bao gồm cả _id của danh mục cha
                "$descendants._id",
              ],
            },
          },
        },
      ]).exec();

      const allCategoryIds = categoryIds[0]?.allIds || [];
      categoryFilter = { type: { $in: allCategoryIds } };
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
      { $match: filters },
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
    const refCategories = await getCategoryHierarchy(category)

    return {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
      refCategories
    };
  } catch (error) {
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
