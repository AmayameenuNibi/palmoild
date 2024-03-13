import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,
  site_id: String,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
