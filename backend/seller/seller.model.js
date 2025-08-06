const mongoose = require("mongoose");

const sellerNotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["order", "payment"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Delivered", "Cancelled"],
    default: "Pending",
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const sellerNotification = mongoose.model(
  "SellerNotification",
  sellerNotificationSchema
);

export default sellerNotification;
