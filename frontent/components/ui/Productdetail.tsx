"use client";
import Image from "next/image";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Chip, CircularProgress, Button } from "@mui/material";
import axiosInstance from "@/lib/axios.instanse";
import { IError } from "@/interface/error.interface";

interface IProductDetails {
  productName: string;
  category: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl: string;
  description: string;
}

const fallbackImage = "/selloffer.png";

const ProductDetail = () => {
  const params = useParams();
  const productId = params?.id as string;

  const { data, isLoading } = useQuery<IProductDetails, IError>({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/productdetail/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress color="warning" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-gray-500 mt-6">Product not found.</p>;
  }

  const {
    productName,
    category,
    price,
    quantity,
    stock,
    imageUrl,
    description,
  } = data;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image */}
      <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <Image
          src={imageUrl || fallbackImage}
          alt={productName}
          width={400}
          height={250}
          className="w-full h-[220px] object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-4 text-gray-800">
        <h1 className="text-3xl font-bold">{productName}</h1>
        <div className="flex flex-wrap gap-2">
          <Chip label={category} color="secondary" variant="outlined" />
        </div>
        <p className="text-green-600 text-2xl font-semibold">
          Rs. {price.toFixed(2)}
        </p>
        <p>
          <strong>Stock:</strong> {stock} pcs
        </p>
        <p>
          <strong>Quantity per unit:</strong> {quantity} pcs
        </p>
        <div className="text-justify border-t pt-4 text-gray-600">
          {description}
        </div>

        <div className="mt-4 flex gap-4">
          <Button variant="contained" color="primary" className="rounded-full">
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => history.back()}
            className="rounded-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
