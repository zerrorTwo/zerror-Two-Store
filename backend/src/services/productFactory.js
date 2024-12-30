import categoryModel from "../models/categoryModelV2.js";
import ProductModel from "../models/productModel.js";
import { categoryServiceV2 } from "./categoryService.js";

class ProductFactory {
  static async createProduct(type, payload) {
    const model = categoryModel.findOne({ name: type });

    if (!model) {
      await categoryServiceV2.createCategory(type, payload.attributes);
    }

    const sanitizedAttributes = {};
    payload.attributes.forEach((attr) => {
      sanitizedAttributes[attr.name] = attr.value;
    });

    const newProduct = new ProductModel({
      ...payload,
      attributes: sanitizedAttributes,
    });
    await newProduct.save();
    return newProduct;
  }
}

export default ProductFactory;
