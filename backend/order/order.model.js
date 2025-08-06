// // backend/models/order.model.js
// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     customer: {
//       name: { type: String, required: true },
//       email: { type: String, required: true },
//       phone: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       postalCode: { type: String },
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["eSewa", "Khalti", "COD"],
//       required: true,
//     },
//     items: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//     total: { type: Number, required: true },
//   },
//   { timestamps: true }
// );
// export default mongoose.model("Order", orderSchema);

// backend/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
    },
    paymentMethod: {
      type: String,
      enum: ["eSewa", "Khalti", "COD"],
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // store product reference
        name: { type: String },
        qty: { type: Number },
        price: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      default: "Pending",
    },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
