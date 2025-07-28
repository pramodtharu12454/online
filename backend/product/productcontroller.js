import exprss from "express";
import product from "./product.model.js";
import { verifyToken } from "../middleware/authenication.middleware.js";

const router = exprss.Router();

router.post("/product/add",verifyToken, async (req, res) => {
  const newProduct = req.body;

  await product.create(newProduct);
  return res.status(201).send({ message: "Product added successfully" });
});

router.get("/product/detail", async (req, res) => {
  const products = await product.find({});
  return res.status(200).send(products);
});

// PUT /api/products/:id - Update a product
router.put("/product/edit/:id",verifyToken, async (req, res) => {
  const productId = req.params.id;

  // extract new values from req.body
  const newValues = req.body;

  console.log(newValues);

  // update product
  await product.updateOne(
    { _id: productId },
    {
      $set: {
        ...newValues,
      },
    }
  );
  return res.status(200).send({ message: "Product is updated successfully." });
});

router.delete("/product/delete/:id",verifyToken, async (req, res) => {
  // extract product id from req.params
  const productId = req.params.id;

  // delete product
  await product.deleteOne({ _id: productId });

  return res.status(200).send({ message: "Product is deleted successfully." });
});

router.get("/product/filter", async (req, res) => {
  try {
    const { category, keyword, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" }; // case-insensitive match
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export { router as productController };
