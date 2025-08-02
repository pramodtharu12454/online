"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

interface Product {
  _id: string;
  productName: string;
  category: string;
  stock: number;
  quantity: number;
  price: number;
  imageUrl: string;
}
// dash -u na thapo

// Code to push check


const fallBackProductImage = "/selloffer.png";
const PRODUCTS_PER_PAGE = 6;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // sets to true if token exists
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/product/detail");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading products...</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen py-10 px-4">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {currentProducts.map((product) => (
          <Box
            key={product._id}
            className="rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/productdetail/${product._id}`)}
            >
              <Image
                src={product.imageUrl || fallBackProductImage}
                alt={product.productName}
                width={400}
                height={250}
                className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-2 text-gray-800">
              <Typography variant="h6" className="font-bold truncate text-lg">
                {product.productName}
              </Typography>
              <p className="text-sm">
                <span className="font-medium">Price:</span> Rs. {product.price}
              </p>
              <p className="text-sm">
                <span className="font-medium">Quantity:</span>{" "}
                {product.quantity}
              </p>

              <div className="mt-4 space-y-2">
                <Button
                  fullWidth
                  onClick={() => router.push(`/productdetail/${product._id}`)}
                  className="!bg-black !text-white hover:!bg-gray-700 rounded-full"
                >
                  View Detail
                </Button>

                {isLoggedIn && (
                  <Button
                    fullWidth
                    onClick={() => console.log("Add to cart:", product._id)}
                    className="!bg-black !text-white hover:!bg-gray-600 rounded-full"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          </Box>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 rounded ${
                currentPage === pageNum
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default ProductList;
