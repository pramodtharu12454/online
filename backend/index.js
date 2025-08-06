import express from "express";
import cors from "cors";

import connectDB from "./db.connection.js";
import { userController } from "./user/usercontroller.js";
import { productController } from "./product/productcontroller.js";
import { cartController } from "./cart/cartcontroller.js";
import { orderController } from "./order/order.controller.js";
import { sellerController } from "./seller/seller.controller.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true,
  })
);
app.use(express.json());
await connectDB();

// Mount auth routes under /user
app.use(userController);
app.use(productController);
app.use(cartController);
app.use(orderController);
app.use(sellerController);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
