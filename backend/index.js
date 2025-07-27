import express from "express";
import cors from "cors";

import connectDB from "./db.connection.js";
import { userController } from "./user/usercontroller.js";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true,
  })
);
app.use(express.json());
connectDB();

// Mount auth routes under /user
app.use(userController);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
