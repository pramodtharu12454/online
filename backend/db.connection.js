import express from "express";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url =
      "mongodb+srv://E-commerce:Rohit123@pramod.49wcu.mongodb.net/onlinebazar?retryWrites=true&w=majority&appName=pramod";
    await mongoose.connect(url);
    console.log("connect database successful.....");
  } catch (error) {
    console.log("db connection failed....");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
