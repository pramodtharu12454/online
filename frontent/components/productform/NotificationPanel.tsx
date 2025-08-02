"use client";
import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axiosInstance from "@/lib/axios.instanse";

interface Order {
  _id: string;
  buyerName: string;
  productName: string;
  quantity: number;
  status: string;
}

interface NotificationPanelProps {
  onSelectOrder: (order: Order) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onSelectOrder,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/recent");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="relative">
      <button
        className="relative text-black hover:text-gray-800"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="w-6 h-6" />
        {orders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {orders.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="p-4 font-bold border-b">Recent Orders</div>
          <ul className="max-h-60 overflow-y-auto">
            {orders.length === 0 ? (
              <li className="p-4 text-gray-500">No new orders</li>
            ) : (
              orders.map((order) => (
                <li
                  key={order._id}
                  onClick={() => {
                    onSelectOrder(order);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <p className="font-medium">{order.buyerName}</p>
                  <p className="text-sm text-gray-500">
                    Ordered {order.quantity}x {order.productName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Status: {order.status}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
