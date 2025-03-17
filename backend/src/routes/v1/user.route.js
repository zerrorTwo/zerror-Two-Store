import express from "express";
import { authentication, authorization } from "../../auth/auth.util.js";
import {
  deleteManyUsers,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  updateCurrentUserProfile,
  updateUserById,
} from "../../controllers/user.controller.js";

const Router = express.Router();

// route need authen
Router.use(authentication);

Router.route("/profile")
  .get(getCurrentUserProfile)
  .put(updateCurrentUserProfile);

// route need authorization for admin role only
Router.use(authorization);

Router.route("/").get(getAllUsers);
Router.route("/delete-many").delete(deleteManyUsers);

Router.route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

export const userRoute = Router;
