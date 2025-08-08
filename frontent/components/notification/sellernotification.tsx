"use client";

import React, { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Package } from "lucide-react";
import axiosInstance from "@/lib/axios.instanse";

// Types
interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: OrderItem[];
  paymentMethod: string;
  total: number;
  status: "Pending" | "Delivered" | "Cancelled";
  createdAt: string;
}

const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Popup state
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<
    "Pending" | "Delivered" | "Cancelled"
  >("Pending");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open popup to change status
  const handleOpenPopup = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpen(true);
  };

  const handleClosePopup = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  // Update status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await axiosInstance.put(`/seller/orders/${selectedOrder._id}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated");
      handleClosePopup();
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />
      <Typography variant="h4" className="font-bold mb-6">
        Seller Orders
      </Typography>

      {orders.length === 0 && (
        <Typography color="text.secondary" className="mt-6">
          No orders found.
        </Typography>
      )}

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="border border-gray-200 rounded-lg shadow-sm"
          >
            <CardContent>
              <div className="flex justify-between items-start">
                {/* Customer Info */}
                <div>
                  <Typography variant="h6" className="font-semibold">
                    {order.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email} | {order.customer.phone}
                  </Typography>
                  <Typography variant="body2">
                    {order.customer.address}, {order.customer.city} -{" "}
                    {order.customer.postalCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment: {order.paymentMethod}
                  </Typography>
                </div>

                {/* Total + Status */}
                <div className="text-right">
                  <Typography className="font-bold text-lg">
                    NPR {order.total.toLocaleString()}
                  </Typography>
                  <Typography
                    className={`inline-block px-2 py-1 rounded-full text-white text-sm mt-2 ${
                      order.status === "Pending"
                        ? "bg-yellow-500"
                        : order.status === "Delivered"
                        ? "bg-green-600"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </Typography>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4">
                <Typography variant="subtitle2" className="font-bold">
                  Items:
                </Typography>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.name} (x{item.qty}) — NPR{" "}
                      {(item.price * item.qty).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<Package size={16} />}
                  onClick={() => handleOpenPopup(order)}
                >
                  Update Status
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Update Popup */}
      <Dialog open={open} onClose={handleClosePopup}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="mb-2">
            Current status: <b>{selectedOrder?.status}</b>
          </Typography>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as "Pending" | "Delivered" | "Cancelled")}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SellerOrdersPage;
