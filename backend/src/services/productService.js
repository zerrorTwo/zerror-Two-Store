import { StatusCodes } from "http-status-codes";
import ProductModel from "../models/productModel.js";
import ClothingModel from "../models/productType/clothingModel.js";
import FoodModel from "../models/productType/foodModel.js";
import ApiError from "../utils/ApiError.js";

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, model) {
    ProductFactory.productRegistry[type] = model;
  }

  static async createProduct(type, payload) {
    const model = ProductFactory.productRegistry[type];
    if (!model) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Product type not found");
    }

    return new Category(payload, model).createProduct();
  }
}

class Product {
  constructor({
    name,
    thumb,
    description,
    img,
    price,
    quantity,
    type,
    reviews = [],
    rating = 0,
    numReviews = 0,
    tag = [],
    attributes = {},
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.img = img;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.reviews = reviews;
    this.rating = rating;
    this.numReviews = numReviews;
    this.tag = tag;
    this.attributes = attributes;
  }

  async createProduct() {
    try {
      return await ProductModel.create(this);
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Error creating product");
    }
  }
}

class Category extends Product {
  constructor(payload, model) {
    super(payload);
    this.model = model;
  }

  async createProduct() {
    try {
      const newCategoryData = await this.model.create(this.attributes);
      if (!newCategoryData) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Error creating ${this.type.toLowerCase()}`
        );
      }

      const newProduct = await super.createProduct();
      return newProduct;
    } catch (error) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Error creating ${this.type.toLowerCase()}`
      );
    }
  }
}

ProductFactory.registerProductType("Clothing", ClothingModel);
ProductFactory.registerProductType("Food", FoodModel);

export const productService = ProductFactory;
