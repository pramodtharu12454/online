import mongoose from "mongoose";

// set rule/schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Product",
  },
  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// create table/model
const CartTable = mongoose.model("Cart", cartSchema);

export default CartTable;
