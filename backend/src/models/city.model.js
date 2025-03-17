import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const CityModel = mongoose.models.city || mongoose.model("City", citySchema);

export default CityModel;
