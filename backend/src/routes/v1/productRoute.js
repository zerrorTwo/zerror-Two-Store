import express from "express";
import { createProduct } from "../../controllers/productController.js";

const Router = express.Router();
Router.post("/", createProduct);

export const productRoute = Router;
