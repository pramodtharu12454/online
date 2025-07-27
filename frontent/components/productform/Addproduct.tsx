"use client";
import React, { useState } from "react";

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

interface AddProductProps {
  onCancel: () => void;
  onAdd: (product: {
    productName: string;
    description: string;
    category: string;
    stock: number;
    quantity: number;
    price: number;
  }) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onCancel, onAdd }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const product = {
      productName,
      description,
      category,
      stock: Number(stock),
      quantity: Number(quantity),
      price: Number(price),
    };
    onAdd(product);

    // Reset form
    setProductName("");
    setDescription("");
    setCategory(categories[0]);
    setStock("");
    setQuantity("");
    setPrice("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white border border-black rounded-lg p-6 md:p-8 shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-black mb-4">
        Add New Product
      </h2>

      {/* Product Name */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          rows={3}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Stock
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          min={0}
          required
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          min={1}
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium text-sm mb-1 text-gray-800">
          Price (in Rs.)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          min={0}
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="border border-black text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
