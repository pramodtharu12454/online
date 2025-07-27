// lib/auth.ts
"use client";
import api from "./axios";

export const registerUser = async (userData: {
  name: string;
  address: string;
  mobileNumber: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/user/register", userData);
  return res.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/user/login", credentials);
  return res.data;
};
