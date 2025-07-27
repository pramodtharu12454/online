"use client";

import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ✅ Define full Product interface
interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  shortDescription: string;
  oldPrice: number;
  discount: number;
  rating: number;
}

// ✅ Fallback image path
const fallBackProductImage = "/selloffer.jpg"; // Adjust this path as needed

// ✅ ProductCard Component
const ProductCard = (props: Product) => {
  const router = useRouter();

  // 🔐 Replace this with real auth session logic later
  const isLoggedIn = true;

  return (
    <Box
      className="w-[300px] h-[500px] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden bg-gradient-to-b from-white to-gray-100"
      sx={{
        "&:hover": {
          transform: "translateY(-5px)",
          transition: "transform 0.3s ease-in-out",
        },
      }}
    >
      <Image
        onClick={() => {
          router.push(`/productdetail/${props._id}`);
        }}
        className="cursor-pointer hover:opacity-90 transition-opacity duration-300 ease-in-out"
        src={props.image || fallBackProductImage}
        height={250}
        width={400}
        alt={props.name}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
        }}
      />

      <Stack className="p-4 space-y-2 h-[250px] overflow-hidden">
        <Box className="flex justify-between items-center">
          <Typography
            variant="h6"
            className="font-bold text-gray-800 truncate w-[75%]"
          >
            {props.name}
          </Typography>
          <Chip label={props.brand} color="warning" className="font-bold" />
        </Box>

        <Typography variant="h6" className="text-gray-700">
          Price:
          <span className="ml-2 text-black hover:text-black-800 font-semibold">
            Rs. {props.price}
          </span>
          {props.oldPrice && (
            <span className="ml-4 text-sm line-through text-gray-500">
              Rs. {props.oldPrice}
            </span>
          )}
        </Typography>

        <Typography
          className="text-sm text-gray-600 text-justify overflow-hidden"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {props.shortDescription}
        </Typography>

        <Typography className="text-sm text-black-500 font-semibold">
          ⭐ {props.rating} | {props.discount}% Off
        </Typography>

        {/* 🚀 Always visible Explore button */}
        <Button
          onClick={() => {
            router.push(`/productdetail/${props._id}`);
          }}
          className="w-full py-4 font-bold text-white bg-black hover:bg-neutral-700 transition-colors duration-300 ease-in-out rounded-full border-4 border-black"
        >
          Explore
        </Button>

        {/* 🛒 Show only if logged in */}
        {isLoggedIn && (
          <Button
            onClick={() => {
              console.log("Add to Cart:", props._id);
              // 🔁 Replace with real cart action
            }}
            className="w-full py-2 font-bold text-white bg-black hover:bg-neutral-700 transition-colors duration-300 ease-in-out rounded-full"
          >
            Add to Cart
          </Button>
        )}
      </Stack>
    </Box>
  );
};
// ✅ ProductList Component
const ProductList = () => {
  const products: Product[] = [
    {
      _id: "1",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      price: 120000,
      shortDescription: "Latest Apple flagship phone",
      oldPrice: 135000,
      discount: 11,
      rating: 4.5,
      image: "/selloffer.png",
    },
    {
      _id: "2",
      name: "Samsung Galaxy Watch",
      brand: "Samsung",
      price: 25000,
      shortDescription: "Smartwatch with advanced features",
      oldPrice: 30000,
      discount: 17,
      rating: 4,
      image: "/mouse.png",
    },
    {
      _id: "3",
      name: "Nike Air Jordan",
      brand: "Nike",
      price: 15000,
      shortDescription: "Popular sports shoes",
      oldPrice: 18000,
      discount: 17,
      rating: 4.8,
      image: "/selloffer.png",
    },
    {
      _id: "3",
      name: "Nike Air Jordan",
      brand: "Nike",
      price: 15000,
      shortDescription: "Popular sports shoes",
      oldPrice: 18000,
      discount: 17,
      rating: 4.8,
      image: "/selloffer.png",
    },
  ];

  return (
    <section className="grid gap-30 md:grid-cols-3 lg:grid-cols-3 p-6">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </section>
  );
};

export default ProductList;
