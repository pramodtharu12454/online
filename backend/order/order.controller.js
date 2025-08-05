import express from "express";
import { verifyToken } from "../middleware/authenication.middleware.js";
import Order from "./order.model.js";
import product from "../product/product.model.js";
const router = express.Router();

router.post("/order/product", verifyToken, async (req, res) => {
  try {
    const { customer, cartItems, paymentMethod } = req.body;
    const userId = req.loggedInUserId; // from middleware

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Fetch product details & calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (let item of cartItems) {
      const Product = await product.findById(item.productId);

      if (!Product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      if (Product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${Product.productName}` });
      }

      // Reduce stock
      Product.stock -= item.quantity;
      await Product.save();

      orderItems.push({
        productId: Product._id,
        quantity: item.quantity,
        price: Product.price,
      });

      totalAmount += Product.price * item.quantity;
    }

    // Create order
    const order = new Order({
      customer,
      user: userId,
      items: orderItems,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/order/get", async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate(
      "items.productId",
      "productName price imageUrl"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export { router as orderController };
