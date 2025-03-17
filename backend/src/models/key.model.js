import mongoose, { Schema } from "mongoose";

const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    publicKey: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const KeyModel = mongoose.model("Key", keyTokenSchema);

export default KeyModel;
