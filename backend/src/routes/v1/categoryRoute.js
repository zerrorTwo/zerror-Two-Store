import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  searchCategory,
  updateCategory,
} from "../../controllers/categoryController.js";
import { authentication, authorization } from "../../auth/authUtil.js";

const Router = express.Router();
Router.get("/search", searchCategory);
Router.get("/", getAllCategory);

Router.use(authentication, authorization);

Router.post("/", createCategory);

Router.route("/:id").put(updateCategory).delete(deleteCategory);

export const categoryRouter = Router;
