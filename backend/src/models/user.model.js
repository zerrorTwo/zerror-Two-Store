import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      minlength: [3, "User name must be at least 3 characters long"],
      maxlength: [50, "User name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      trim: true,
    },
    number: {
      type: String,
      unique: false,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      required: function () {
        return this.authenticationType === "local"; // Chỉ yêu cầu password nếu là đăng nhập local
      },
    },
    googleId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    authenticationType: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true,
      default: "local",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: null,
    },
    codeExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
