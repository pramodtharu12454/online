import express from "express";
import product from "./product.model.js";
import { verifyToken } from "../middleware/authenication.middleware.js";
import { singleUpload } from "../middleware/upload.js";
import getDataUri from "../middleware/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

router.post("/product/add", verifyToken, singleUpload, async (req, res) => {
  try {
    const { productName, description, category, stock, quantity, price } =
      req.body;

    // Validate required fields
    if (
      !productName ||
      !description ||
      !category ||
      !stock ||
      !quantity ||
      !price
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // Convert file to Data URI
    const fileUri = getDataUri(file);

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "image",
      folder: "products",
      use_filename: true,
      unique_filename: false,
    });

    const imageUrl = cloudResponse.secure_url;

    // Get seller ID from token
    const sellerId = req.loggedInUserId;
    if (!sellerId) {
      return res.status(401).json({ message: "Invalid Seller ID" });
    }

    // Save product
    await product.create({
      productName,
      description,
      category,
      stock,
      quantity,
      price,
      imageUrl,
      sellerId,
    });

    return res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

router.get("/product/detail", async (req, res) => {
  const products = await product.find({});
  return res.status(200).send(products);
});

// PUT /api/products/:id - Update a product
router.put("/product/edit/:id", verifyToken, async (req, res) => {
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

router.delete("/product/delete/:id", verifyToken, async (req, res) => {
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

router.get("/productdetail/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const productDetail = await product.findById(productId);
    if (!productDetail) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send(productDetail);
  } catch (error) {
    return res.status(500).send({ message: "Error fetching product details" });
  }
});

// list product by seller
router.post("/product/detail/list", verifyToken, async (req, res) => {
  const paginationData = req.body;

  const page = paginationData.page;
  const limit = paginationData.limit;

  // calculate skip using limit and page
  const skip = (page - 1) * limit;
  const products = await product.aggregate([
    {
      $match: {
        sellerId: req.loggedInUserId, // filter products using sellerId
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    { $limit: limit },
    {
      $project: {
        productName: 1,
        category: 1,
        price: 1,
        quantity: 1,
        stock: 1,
        image: 1,
        description: 1,
      },
    },
  ]);

  const totalItems = await product
    .find({
      sellerId: req.loggedInUserId,
    })
    .countDocuments();

  const totalPage = Math.ceil(totalItems / limit);

  return res
    .status(200)
    .send({ message: "success", productList: products, totalPage });
});

// Product Filter
router.post("/product/filter", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.body;

    let query = {};
    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sort = {};
    if (sortBy === "lowToHigh") sort.price = 1;
    else if (sortBy === "highToLow") sort.price = -1;
    else sort.createdAt = -1;

    const products = await product.find(query).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Product Delete in cart 
export { router as productController };
