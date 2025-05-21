import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: {type: String, unique: true},
    price: Number,
    status: {type: Boolean, default: true},
    stock: {type: Number, default: 0},
    category: String,
    thumbnails: {type: [String], default: []}

});
productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model("products", productSchema);