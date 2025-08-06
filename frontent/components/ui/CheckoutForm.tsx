"use client";
import axiosInstance from "@/lib/axios.instanse";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

const CheckoutForm = () => {
  const router = useRouter();

  const [cartitem, setCartitem] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0); // <-- total state
  const [submitting, setSubmitting] = useState(false);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axiosInstance.get("/cart/items");
        const normalizedData = (res.data || []).map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }));

        setCartitem(normalizedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCartItems();
  }, []);

  // Calculate total whenever cart items change
  useEffect(() => {
    const totalAmount = cartitem.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  }, [cartitem]); // <-- recalculate when cartitem updates

  // Customer form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "eSewa",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle payment method selection
  const handlePaymentChange = (method: string) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  // Submit order to backend
  const handlePlaceOrder = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (cartitem.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const items = cartitem.map((item) => ({
      productId: item.productId,
      name: item.productName,
      qty: item.quantity,
      price: item.price,
    }));

    const orderData = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      items,
      paymentMethod: formData.paymentMethod,
      total, // calculated dynamically
    };

    try {
      setSubmitting(true);
      await axiosInstance.post("/order/product", orderData);
      toast.success("Order placed successfully!");

      localStorage.removeItem("checkoutcartitem");
      localStorage.removeItem("checkoutTotal");
    } catch (error: any) {
      console.error("Order placement failed:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <Toaster position="top-right" />
      {/* LEFT: Customer Info */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">Customer Information</h2>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <div className="flex gap-2">
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
        </div>
        <h2 className="font-bold text-lg">Delivery Address</h2>
        <input
          name="address"
          placeholder="Street Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <div className="flex gap-2">
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className="border p-2 flex-1"
          />
        </div>

        {/* Payment Method */}
        <h2 className="font-bold text-lg">Payment Method</h2>
        <div className="space-y-2">
          {["eSewa", "Khalti", "COD"].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                checked={formData.paymentMethod === method}
                onChange={() => handlePaymentChange(method)}
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      {/* RIGHT: Order Summary */}
      <div>
        <h2 className="font-bold text-lg mb-2">Order Summary</h2>
        <div className="border p-4 space-y-2 max-h-[400px] overflow-y-auto">
          {cartitem.length === 0 && <p>Your cart is empty.</p>}

          {cartitem.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>
                {item.productName} (x{item.quantity})
              </span>
              <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>NPR {total.toLocaleString()}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-2 mt-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || cartitem.length === 0}
          >
            {submitting ? "Placing Order..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
