"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Box, Button, Typography, Chip } from "@mui/material";
import { Heart } from "lucide-react";
import axiosInstance from "@/lib/axios.instanse";

interface Product {
  _id: string;
  productName: string;
  category: string;
  stock: number;
  quantity: number;
  price: number;
  imageUrl: string;
}

const fallBackProductImage = "/selloffer.png";
const PRODUCTS_PER_PAGE = 9;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);

  const router = useRouter();

  const handleAddToCart = async (id: string) => {
    if (cartProductIds.includes(id)) {
      alert("Product already in cart");
      return;
    }

    try {
      await axiosInstance.post(`/cart/item/add/${id}`);
      setCartProductIds((prev) => [...prev, id]); // update local state
      router.push("/cart");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // if (token) {
    //   axiosInstance
    //     .get("/cart/item")
    //     .then((res) => {
    //       const ids = res.data.map((item: any) => item.productId);
    //       setCartProductIds(ids);
    //     })
    //     .catch((err) => {
    //       console.error("Failed to fetch cart items:", err);
    //     });
    // }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/product/detail");
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
    <main className="bg-gradient-to-br from-white to-white min-h-screen px-4">
      <p className="py-4 text-gray-600">Total {products.length} products</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {currentProducts.map((product) => (
          <Box
            key={product._id}
            className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Product Image */}
            <div className="relative cursor-pointer">
              <Image
                src={product.imageUrl || fallBackProductImage}
                alt={product.productName}
                width={500}
                height={300}
                className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => router.push(`/productdetail/${product._id}`)}
              />
              {/* Heart Icon */}
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                <Heart size={18} className="text-red-500" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-row justify-between items-start p-4">
              <div className="space-y-2 text-gray-800 flex-1">
                <Typography variant="h6" className="font-bold text-lg truncate">
                  {product.productName}
                </Typography>
                <p className="text-sm">
                  <span className="font-medium">Price:</span> Rs.{" "}
                  {product.price}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Qty/Unit:</span>{" "}
                  {product.quantity}
                </p>
              </div>
              <Chip
                label={product.category}
                color="secondary"
                variant="outlined"
                className="ml-4"
              />
            </div>

            {/* Buttons */}
            <div className="px-4 pb-4 mt-auto space-y-2">
              <Button
                fullWidth
                onClick={() => router.push(`/productdetail/${product._id}`)}
                className="!bg-black !text-white hover:!bg-gray-800 rounded-full"
              >
                View Detail
              </Button>

              {isLoggedIn && (
                <Button
                  fullWidth
                  onClick={() => handleAddToCart(product._id)}
                  className="!bg-blue-600 !text-white hover:!bg-blue-800 rounded-full"
                >
                  {cartProductIds.includes(product._id)
                    ? "Already in Cart"
                    : "Add to Cart"}
                </Button>
              )}
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
