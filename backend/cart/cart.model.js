import mongoose from "mongoose";

// set rule/schema
const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    
    ref: "User",
  },
  productId: {
    type: mongoose.ObjectId,
    required: true,
    ref: "Product",
  },
  orderedQuantity: {
    type: Number,
      min: 1,
  },
});

// create table/model
const CartTable = mongoose.model("Cart", cartSchema);

export default CartTable;
