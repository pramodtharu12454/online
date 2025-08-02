import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Grocery",
        "Clothing",
        "Kids",
        "Stationery",
        "Kitchen",
        "Furniture",
        "Electronics",
        "Electrical",
        "Sports",
      ],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", productSchema);
export default product;
