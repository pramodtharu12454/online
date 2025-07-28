import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting: Bearer <token>

  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // extract payload from token by decryption
  let payload = null;

  try {
    const secretKey = "ajfdkadjak8329jkdakdj";

    payload = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }
  const user = await User.findOne({ email: payload.email });
  req.loggedInUserId = user._id;
  next();
};
