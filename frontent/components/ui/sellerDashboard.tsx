"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import EditProduct from "../productform/EditProduct";

const products = [
  {
    name: "iPhone 15 Pro Max",
    price: "₨120,000",
    stock: 15,
    status: "Active",
    sales: 45,
    image: "https://via.placeholder.com/50?text=📱",
    description: "Latest Apple flagship with advanced camera and performance.",
    rating: 4.5,
  },
  {
    name: "Samsung Galaxy Watch",
    price: "₨25,000",
    stock: 8,
    status: "Active",
    sales: 23,
    image: "https://via.placeholder.com/50?text=⌚",
    description: "Smartwatch with fitness tracking and AMOLED display.",
    rating: 4.0,
  },
  {
    name: "MacBook Pro M3",
    price: "₨250,000",
    stock: 0,
    status: "Out of Stock",
    sales: 12,
    image: "https://via.placeholder.com/50?text=💻",
    description: "Powerful laptop for professionals and creators.",
    rating: 4.8,
  },
];

const SellerDashboard: React.FC = () => {
  const router = useRouter();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Close the modal
  const closeModal = () => setEditIndex(null);

  return (
    <div className="p-8 font-sans relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your products and track sales</p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg"
          onClick={() => router.push("/addproduct")}
        >
          + Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold">{products.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Products</p>
          <p className="text-2xl font-semibold">
            {products.filter((p) => p.status === "Active").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-semibold">
            {products.reduce((a, b) => a + b.sales, 0)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold">₨8,975,000</p>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-6">
        {products.map((prod, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row border border-black rounded-lg bg-white p-4 gap-6 items-center"
          >
            <div className="flex-shrink-0 flex items-center justify-center md:w-1/5">
              <img
                src={prod.image}
                alt={prod.name}
                className="h-24 w-24 object-cover rounded"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-bold text-black text-xl mb-2">
                  {prod.name}
                </h3>
                <p className="text-lg text-black font-semibold mb-1">
                  {prod.price}
                </p>
                <p className="text-gray-700 mb-2">{prod.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Rating: {prod.rating} ⭐
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Stock: {prod.stock}
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Edit
                  className="w-6 h-6 cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setEditIndex(idx)}
                />
                <Trash2 className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {editIndex !== null && (
        <div
          className="fixed inset-0 bg-transparent  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            <EditProduct
              initialProduct={{
                productName: products[editIndex].name,
                description: products[editIndex].description,
                category: "",
                stock: products[editIndex].stock,
                quantity: 1,
                price: Number(products[editIndex].price.replace(/[^\d]/g, "")),
              }}
              onCancel={closeModal}
              onSave={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
