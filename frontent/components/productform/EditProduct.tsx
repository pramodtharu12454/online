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

interface EditProductProps {
  initialProduct: {
    productName: string;
    description: string;
    category: string;
    stock: number;
    quantity: number;
    price: number;
  };
  onCancel: () => void;
  onSave: (product: {
    productName: string;
    description: string;
    category: string;
    stock: number;
    quantity: number;
    price: number;
  }) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ initialProduct, onCancel, onSave }) => {
  const [productName, setProductName] = useState(initialProduct.productName);
  const [description, setDescription] = useState(initialProduct.description);
  const [category, setCategory] = useState(initialProduct.category);
  const [stock, setStock] = useState(initialProduct.stock.toString());
  const [quantity, setQuantity] = useState(initialProduct.quantity.toString());
  const [price, setPrice] = useState(initialProduct.price.toString());

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
    if (onSave) onSave(product);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white border border-black rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-black mb-4">Edit Product</h2>
      <div>
        <label className="block font-medium text-gray-800 mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          min="0"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-1">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-800 mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-black rounded px-3 py-2"
          min="0"
          required
        />
      </div>
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProduct;