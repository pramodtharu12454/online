import express from "express";
import orderModel from "../order/order.model.js";
// import { verifyToken } from "../middleware/authenication.middleware";

const router = express.Router();

// GET seller notifications
router.get("/seller/notifications", async (req, res) => {
  try {
    // Fetch latest orders
    const orders = await orderModel.find().sort({ createdAt: -1 }).limit(20);

    // Map orders to notification format
    const notifications = orders.map((order) => ({
      id: order._id.toString(),
      type: "order",
      message: `Order from ${order.customer.name} - ${order.items.length} items`,
      amount: order.total,
      orderId: order._id.toString(),
      timeAgo: timeAgo(order.createdAt),
      status: order.status || "Pending", // add status field in schema
      urgent: order.total > 100000, // Example: mark high-value orders as urgent
    }));

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper: time ago formatting
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

// Update order status
router.put("/seller/orders/:id/status",  async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Status updated", order });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as sellerController };
