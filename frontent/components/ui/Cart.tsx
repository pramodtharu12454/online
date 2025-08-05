"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios.instanse";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch cart items from API

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/cart/items");
        const normalizedData = (res.data || []).map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }));

        setCartItems(normalizedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // (Removed unused addToCart function)

  // Update quantity of a cart item
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.put("/cart/item/update", {
        productId,
        orderedQuantity: newQuantity,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating quantity");
    }
  };

  // Remove single item
  const handleRemoveItem = async (productId: string) => {
    try {
      await axiosInstance.post("/item/remove", { productId });
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Error removing item");
    }
  };

  // Bulk delete selected items
  const handleBulkDelete = async () => {
    try {
      await axiosInstance.post("/item/bulk-remove", {
        productIds: selectedItems,
      });
      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.includes(item.productId))
      );
      setSelectedItems([]);
      setSelectAll(false);
      toast.success("Selected items deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting selected items");
    }
  };

  // Toggle select single item
  const toggleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(cartItems.map((item) => item.productId));
      setSelectAll(true);
    }
  };

  // Sync selectAll state with selectedItems and cartItems length
  React.useEffect(() => {
    setSelectAll(
      selectedItems.length === cartItems.length && cartItems.length > 0
    );
  }, [selectedItems, cartItems]);

  // Calculate totals
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cartItems.length === 0 && <p>Your cart is empty.</p>}

          {cartItems.length > 0 && (
            <div className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
                id="select-all"
              />
              <label
                htmlFor="select-all"
                className="select-none cursor-pointer"
              >
                Select All
              </label>
            </div>
          )}

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productId)}
                  onChange={() => toggleSelectItem(item.productId)}
                />
                <Image
                  src={item.imageUrl || "/selloffer.png"}
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
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border px-2 py-1 rounded">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm">
                  {/* Subtotal: ₨ {(item.price * item.quantity).toLocaleString()} */}
                  Subtotal: ₨ {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded mt-4"
            >
              Delete Selected ({selectedItems.length})
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between">
              <span>
                Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)}{" "}
                items)
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
            <button
              className="w-full bg-black text-white py-2 mt-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => router.push("/CheckoutForm")}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            <button
              className="w-full border mt-2 py-2 rounded"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </button>
          </div>

          {selectedItems.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Selected Summary</h3>
              <div className="flex justify-between">
                <span>Selected Items</span>
                <span>{selectedItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Total</span>
                <span>₨ {selectedTotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
