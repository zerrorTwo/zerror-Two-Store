import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: mongoose.Types.ObjectId, ref: "City", required: true },
    district: {
      type: mongoose.Types.ObjectId,
      ref: "District",
      required: true,
    },
    ward: { type: mongoose.Types.ObjectId, ref: "Ward", required: true },
    street: { type: String, required: true },
    setDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AddressModel =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default AddressModel;
