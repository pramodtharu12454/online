"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Bell, ShoppingCart, DollarSign, Package } from "lucide-react";
import axiosInstance from "@/lib/axios.instanse";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: "order" | "payment";
  message: string;
  amount: number;
  orderId?: string;
  timeAgo: string;
  status?: string;
  urgent?: boolean;
}

const SellerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/api/seller/notifications");
      setNotifications(res.data);
    } catch {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.put(`/api/seller/orders/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status updated");
      fetchNotifications();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Bell />
        <Typography variant="h5" fontWeight="bold">
          Seller Dashboard
        </Typography>
      </Box>

      {notifications.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          No notifications found.
        </Typography>
      )}

      {notifications.map((notification) => (
        <Card
          key={notification.id}
          sx={{
            border:
              notification.type === "order"
                ? "1px solid red"
                : "1px solid #ccc",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                {notification.type === "order" ? (
                  <Box
                    bgcolor="#7F00FF"
                    color="white"
                    borderRadius="50%"
                    p={1.5}
                  >
                    <ShoppingCart size={20} />
                  </Box>
                ) : (
                  <Box bgcolor="green" color="white" borderRadius="50%" p={1.5}>
                    <DollarSign size={20} />
                  </Box>
                )}

                <Box>
                  <Typography fontWeight="bold">
                    {notification.type === "order"
                      ? "New Order Received!"
                      : "Payment Received!"}
                  </Typography>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography color="green" fontWeight="bold">
                    NPR {notification.amount?.toLocaleString?.() ?? "0"}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={notification.type === "order" ? "New Order" : "Payment"}
                color="secondary"
                variant="filled"
              />
            </Box>

            {notification.type === "order" && (
              <Box mt={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Package size={18} />
                  <Typography>Status:</Typography>
                  <Select
                    size="small"
                    value={notification.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(
                        notification.id,
                        e.target.value as string
                      )
                    }
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>

                  {notification.urgent && (
                    <Chip
                      label="Urgent"
                      color="error"
                      size="small"
                      variant="filled"
                    />
                  )}
                </Box>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <Typography variant="caption">
                {notification.orderId && (
                  <>Order #{notification.orderId} &nbsp;•&nbsp;</>
                )}
                {notification.timeAgo}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SellerNotifications;
