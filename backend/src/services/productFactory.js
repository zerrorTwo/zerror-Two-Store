import ProductModel from "../models/productModel.js";
import { categoryServiceV2 } from "./categoryServiceV2.js";

class ProductFactory {
  static productRegistry = {};

  static async createProduct(type, payload) {
    let model = ProductFactory.productRegistry[type];
    if (!model) {
      model = await categoryServiceV2.createCategory(type, payload.attributes);
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
