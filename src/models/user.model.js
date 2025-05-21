import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_name: { type: String, unique: true },
    password: String,
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }
});
export const userModel = mongoose.model("users", userSchema);