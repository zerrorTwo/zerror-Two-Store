import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getAllCategoryParent,
  getChildCategories,
  updateCategory,
} from "../../controllers/categoryController.js";
import { authentication, authorization } from "../../auth/authUtil.js";

const Router = express.Router();

Router.route("/all").get(getAllCategory);

Router.route("/").get(getAllCategoryParent);

// Router.use(authentication, authorization);

Router.route("/").delete(deleteCategory).post(createCategory);

Router.route("/:id").put(updateCategory).get(getChildCategories);

export const categoryRouter = Router;
