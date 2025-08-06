import express from "express";
import { verifyToken } from "../middleware/authenication.middleware.js";
import Order from "./order.model.js";

const router = express.Router();

// router.post("/order/product", verifyToken, async (req, res) => {
//   try {
//     const { customer, items, paymentMethod, total } = req.body;

//     if (!customer || !items || !paymentMethod || total === undefined) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const order = new Order({
//       customer,
//       items,
//       paymentMethod,
//       total,
//     });

//     await order.save();

//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/order/product", verifyToken, async (req, res) => {
  try {
    const { customer, items, paymentMethod, total } = req.body;

    const userId = req.loggedInUserId; // from verifyToken

    // Validation
    if (
      !customer ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !paymentMethod ||
      total === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Map items to ensure productId is ObjectId
    const formattedItems = items.map((item) => ({
      productId: item.productId, // already ObjectId from frontend
      name: item.name,
      qty: item.qty,
      price: item.price,
    }));

    // Create new order
    const order = new Order({
      buyerId: userId,
      customer,
      items: formattedItems,
      paymentMethod,
      status: "Pending", // default status
      total,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/seller/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update order status (your style)
router.put("/seller/orders/:id/status", async (req, res) => {
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

router.get("/buyer/orders", verifyToken, async (req, res) => {
  try {
    const buyerId = req.loggedInUserId; // from verifyToken

    const orders = await Order.find({ buyerId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this buyer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export { router as orderController };
