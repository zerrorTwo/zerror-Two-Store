import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  districtId: { type: String, required: true },
});

const WardModel = mongoose.models.ward || mongoose.model("Ward", wardSchema);

export default WardModel;
