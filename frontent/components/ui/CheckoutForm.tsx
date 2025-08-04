"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios.instanse";

const paymentMethods = [
  { value: "khalti", label: "Khalti" },
  { value: "esewa", label: "eSewa" },
  { value: "cod", label: "Cash on Delivery" },
];

interface CheckoutFormProps {
  cartItems: { productId: string; quantity: number }[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, address, mobile, postalCode } = formData;

    if (!name || !email || !address || !mobile || !postalCode) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/orders", {
        customer: { name, email, address, mobile, postalCode },
        cartItems,
        paymentMethod: formData.paymentMethod,
      });

      toast.success("Order placed successfully!");

      setFormData({
        name: "",
        email: "",
        address: "",
        mobile: "",
        postalCode: "",
        paymentMethod: "cod",
      });
    } catch (err) {
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          border: "1px solid #ddd",
          boxShadow: "none",
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                color: "#000",
              }}
            >
              Checkout Form
            </Typography>
          }
          sx={{ px: 3, py: 2 }}
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            />
            <TextField
              select
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: "#000" } }}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CheckoutForm;
