import express from "express";
import product from "../product/product.model.js";
import CartTable from "./cart.model.js";
import { verifyToken } from "../middleware/authenication.middleware.js";

const router = express.Router();

// add item to cart
router.post("/cart/item/add/:id", verifyToken, async (req, res, next) => {
  const productId = req.params.id;

  const Product = await product.findOne({ _id: productId });

  // if not product, throw error
  if (!Product) {
    return res.status(404).send({ message: "Product does not exist." });
  }
  const cart = await CartTable.findOne({ _id: productId });

  if (cart) {
    return res.status(404).send({ message: "Already on cart." });
  }

  // if ordered quantity is greater than product quantity, throw error

  console.log(req.loggedInUserId);
  await CartTable.create({
    buyerId: req.loggedInUserId,
    productId,
  });

  return res.status(200).send({
    message: "Item is added to cart successfully.",
  });
});

router.get("/cart/items", verifyToken, async (req, res) => {
  try {
    const cartItems = await CartTable.find({
      buyerId: req.loggedInUserId,
    }).populate("productId", "productName price category imageUrl");

    const CartItems = cartItems.map((item) => ({
      _id: item._id,
      productId: item.productId._id,
      productName: item.productId.productName,
      price: item.productId.price,
      category: item.productId.category,
      imageUrl: item.productId.imageUrl,
      quantity: item.orderedQuantity,
    }));

    res.json(CartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

// Update cart item quantity
router.put("/cart/item/update", verifyToken, async (req, res) => {
  try {
    const { productId, orderedQuantity } = req.body;

    const cartItem = await CartTable.findOne({
      buyerId: req.loggedInUserId,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    cartItem.orderedQuantity = orderedQuantity;
    await cartItem.save();

    res.json({ message: "Cart updated successfully", cartItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/item/bulk-remove", async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: "productIds array is required" });
  }

  try {
    const result = await CartTable.deleteMany({
      productId: { $in: productIds },
    });
    res.json({
      message: "Selected items removed successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error removing cart items:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/item/remove", async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }

  try {
    const result = await CartTable.findOneAndDelete({ productId }); // Modify filter for your schema
    if (!result) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item removed successfully", removedItem: result });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ error: "Server error" });
  }
});
export { router as cartController };
