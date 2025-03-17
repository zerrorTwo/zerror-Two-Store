import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  provinceId: { type: String, required: true },
});

const DistrictModel =
  mongoose.models.district || mongoose.model("District", districtSchema);

export default DistrictModel;
