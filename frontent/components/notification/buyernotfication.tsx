"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios.instanse";

interface OrderItem {
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

const BuyerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/buyer/orders");
        setOrders(res.data);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 && <p>No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{order.customer.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-white text-sm ${
                  order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Delivered"
                    ? "bg-green-600"
                    : "bg-red-500"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              {order.customer.address}, {order.customer.city} •{" "}
              {order.paymentMethod}
            </p>

            <ul className="mt-2 text-sm">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} (x{item.qty}) — NPR{" "}
                  {(item.price * item.qty).toLocaleString()}
                </li>
              ))}
            </ul>

            <p className="font-bold mt-2">
              Total: NPR {order.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerOrders;
