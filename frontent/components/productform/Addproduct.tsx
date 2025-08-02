"use client";

import axiosInstance from "@/lib/axios.instanse";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const categories = [
  "Grocery",
  "Clothing",
  "Kids",
  "Stationery",
  "Kitchen",
  "Furniture",
  "Electronics",
  "Electrical",
  "Sports",
];

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const router = useRouter();

  // Handle file change
  const fileHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setLocalUrl(URL.createObjectURL(file));
    }
  };

  // Submit product with FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Please login first.");
      router.push("/login");
      return;
    }

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("file", image); // Ensure backend expects `file` or `image` key

    try {
      setImageLoading(true);

      const res = await axiosInstance.post(
        "/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(res.data.message || "Product added successfully");
      router.push("/sellerDashboard");
    } catch (err: any) {
      console.error("AddProduct error:", err);
      toast.error(
        err.response?.data?.error || "Failed to add product. Try again later."
      );
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white border border-black rounded-lg p-6 md:p-8 shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        Add New Product
      </h2>

      {/* Image Preview */}
      {localUrl && (
        <Image
          src={localUrl}
          alt="Preview"
          width={450}
          height={300}
          className="object-cover rounded-md mb-3"
        />
      )}

      {/* Image Upload */}
      <input type="file" accept="image/*" onChange={fileHandleChange} required />

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-black rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          className="w-full px-3 py-2 border border-black rounded"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-black rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min={0}
          required
          className="w-full px-3 py-2 border border-black rounded"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min={1}
          required
          className="w-full px-3 py-2 border border-black rounded"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium">Price (in Rs.)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min={0}
          required
          className="w-full px-3 py-2 border border-black rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/sellerDashboard")}
          className="border border-black px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={imageLoading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {imageLoading ? "Uploading..." : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
