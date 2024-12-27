import express from "express";
import { authentication, authorization } from "../../auth/authUtil.js";
import {
  deleteManyUsers,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  updateCurrentUserProfile,
  updateUserById,
} from "../../controllers/userCotroller.js";

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
