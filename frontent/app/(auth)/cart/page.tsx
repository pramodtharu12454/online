"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios.instanse";

interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart/items");
      console.log(res.data)
      setCartItems(res.data);
    } catch (err: any) {
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update quantity
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await axiosInstance.put("/cart/item/update", {
        productId,
        orderedQuantity: newQuantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      alert("Error updating quantity");
    }
  };

  // Calculate total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.length === 0 && <p>Your cart is empty.</p>}
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.imageUrl || "/fallback.png"}
                  alt={item.productName}
                  width={80}
                  height={80}
                  className="rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.productName}</h2>
                  <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="mt-2">
                    <p className="text-xl font-bold">₨ {item.price}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border px-2 py-1 rounded">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm">
                  Subtotal: ₨ {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between">
              <span>
                Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
              <span>₨ {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span className="text-green-500">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>₨ {totalPrice.toLocaleString()}</span>
            </div>
            <button className="w-full bg-black text-white py-2 mt-4 rounded">
              Proceed to Checkout
            </button>
            <button className="w-full border mt-2 py-2 rounded">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
