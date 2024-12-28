import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../controllers/categoryController.js";
import { authentication, authorization } from "../../auth/authUtil.js";

const Router = express.Router();

Router.route("/").get(getAllCategory);

Router.use(authentication, authorization);
Router.route("/").post(createCategory);

Router.route("/:id").put(updateCategory).delete(deleteCategory);

export const categoryRouter = Router;
