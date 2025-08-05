"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from "@mui/material";
import { User, MapPin, CreditCard } from "lucide-react";
import axiosInstance from "@/lib/axios.instanse";
import toast from "react-hot-toast";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    paymentMethod: "eSewa",
  });

  const orderSummary = [
    { name: "Premium Wireless Headphones", qty: 1, price: 15000 },
    { name: "Phone Case", qty: 2, price: 1200 },
  ];

  const total = orderSummary.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/api/orders", {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          address: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        items: orderSummary,
        total,
      });
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={2}
      padding={2}
    >
      <Box flex={1} display="flex" flexDirection="column" gap={2}>
        {/* Customer Info */}
        <Card>
          <CardHeader
            avatar={<User />}
            title={
              <Typography fontWeight="bold">Customer Information</Typography>
            }
          />
          <CardContent>
            <TextField
              label="Full Name *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Email Address *"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number *"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader
            avatar={<MapPin />}
            title={<Typography fontWeight="bold">Delivery Address</Typography>}
          />
          <CardContent>
            <TextField
              label="Street Address *"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader
            avatar={<CreditCard />}
            title={<Typography fontWeight="bold">Payment Method</Typography>}
          />
          <CardContent>
            <RadioGroup
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <FormControlLabel
                value="eSewa"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>eSewa</Typography>
                    <Typography variant="caption">
                      Pay securely with your eSewa wallet
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="Khalti"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>Khalti</Typography>
                    <Typography variant="caption">
                      Digital wallet for instant payments
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="COD"
                control={<Radio />}
                label={
                  <Box>
                    <Typography>Cash on Delivery</Typography>
                    <Typography variant="caption">
                      Pay when you receive your order (No advance payment)
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </CardContent>
        </Card>
      </Box>

      {/* Order Summary */}
      <Box flex={1}>
        <Card>
          <CardHeader
            title={<Typography fontWeight="bold">Order Summary</Typography>}
          />
          <CardContent>
            {orderSummary.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Box>
                  <Typography>{item.name}</Typography>
                  <Typography variant="caption">Qty: {item.qty}</Typography>
                </Box>
                <Typography>NPR {item.price.toLocaleString()}</Typography>
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold">
                NPR {total.toLocaleString()}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, background: "black" }}
              onClick={handleSubmit}
            >
              Place Order
            </Button>
            <Typography variant="caption" display="block" mt={1}>
              By placing this order, you agree to our terms and conditions
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CheckoutForm;
