"use client";
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react";

import Link from "next/link";
import React, { useState } from "react";

const ProductDetails: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const images = [
    "/selloffer.png", // Replace with your real paths
    "/selloffer.png",
    "/selloffer.png",
  ];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        href="/"
        className="text-sm text-blue-600 mb-4 inline-block hover:underline"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-4">
        {/* Left Side: Images */}
        <div>
          <img
            src={images[0]}
            alt="Product"
            className="w-full rounded-lg mb-4 object-cover"
          />
          <div className="flex gap-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-300 cursor-pointer hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div>
          <span className="text-sm bg-black text-white px-2 py-1 rounded-full">
            Electronics
          </span>
          <h1 className="text-3xl font-bold mt-2">iPhone 15 Pro Max</h1>

          <div className="flex items-center gap-2 mt-1 text-yellow-500">
            ★★★★☆{" "}
            <span className="text-gray-500 ml-1">(4.8 / 124 reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold text-black">₨120,000</span>
            <span className="line-through text-gray-400 text-lg">₨135,000</span>
            <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full">
              -11%
            </span>
          </div>

          {/* Stock */}
          <div className="mt-2 text-sm">
            Stock:{" "}
            <span className="bg-black text-white px-2 py-0.5 rounded-full">
              15 available
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded">
              <button
                className="px-2 py-1 hover:bg-gray-100"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus size={16} />
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="px-2 py-1 hover:bg-gray-100"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="border px-3 py-3 rounded-lg hover:bg-gray-100">
              <Heart size={20} />
            </button>
            <button className="border px-3 py-3 rounded-lg hover:bg-gray-100">
              <Share2 size={20} />
            </button>
          </div>

          {/* Key Features */}
          <div className="mt-8 border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Key Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Titanium Design</li>
              <li>A17 Pro Chip</li>
              <li>Pro Camera System</li>
              <li>Action Button</li>
              <li>USB-C Connector</li>
            </ul>
          </div>

          {/* Footer Info */}
          <div className="flex gap-8 text-sm text-gray-700 mt-6">
            <div className="flex items-center gap-1">🚚 Free Delivery</div>
            <div className="flex items-center gap-1">🔄 Easy Returns</div>
            <div className="flex items-center gap-1">🛡 Warranty</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
