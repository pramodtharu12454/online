import express from "express";
import bcrypt from "bcrypt";
import User from "./user.model.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register
router.post("/user/register", async (req, res) => {
  const newUser = req.body;

  const user = await User.findOne({ email: newUser.email });

  //  if user, throw error

  if (user) {
    return res.status(409).send({ message: "user already exists." });
  }

  const plainPassword = newUser.password;
  const saltround = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltround);

  newUser.password = hashedPassword;

  await User.create(newUser);

  return res.status(201).send({ message: "User is registered successfully." });
});

// Login
router.post("/user/login", async (req, res) => {
  // extract loginCredentials from req.body
  const loginCredentials = req.body;

  // find user with provided email
  const user = await User.findOne({ email: loginCredentials.email });

  // if not user,throw error
  if (!user) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // check for password match
  // requirement: plain password, hashed password
  const plainPassword = loginCredentials.password;
  const hashedPassword = user.password;
  const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

  if (!isPasswordMatch) {
    return res.status(404).send({ message: "Invalid credentials." });
  }

  // generate token
  // payload => object inside token
  const payload = { email: user.email };
  const secretKey = "ajfdkadjak8329jkdakdj";

  const token = jwt.sign(payload, secretKey, {
    expiresIn: "7d",
  });

  // remove password before sending to user
  user.password = undefined;

  return res.status(200).send({ message: "success", accessToken: token });
});
export { router as userController };
