"use client";
import React from "react";

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

const FilterSidebar = () => (
  <aside className="border border-black rounded-lg p-4 bg-white w-full md:w-64">
    <h3 className="font-bold mb-4 text-black">Categories</h3>
    <ul className="space-y-2 mb-6">
      {categories.map((category) => (
        <li key={category}>
          <button className="w-full text-left px-2 py-1 rounded border border-black text-black hover:bg-gray-100">
            {category}
          </button>
        </li>
      ))}
    </ul>
    <div className="mb-6">
      <h4 className="font-semibold text-black mb-2">Price Range</h4>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          className="w-16 border border-black rounded px-2 py-1"
        />
        <span className="text-black">-</span>
        <input
          type="number"
          placeholder="Max"
          className="w-16 border border-black rounded px-2 py-1"
        />
      </div>
    </div>
  </aside>
);

export default FilterSidebar;
