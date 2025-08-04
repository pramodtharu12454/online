"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import EditProduct from "../productform/EditProduct";
import axiosInstance from "@/lib/axios.instanse";
import Image from "next/image";
import NotificationPanel from "../productform/NotificationPanel";
// ✅ import NotificationPanel

const SellerDashboard: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  console.log(products);

  // ✅ Order notification handler (currently just logs to console)
  const handleSelectOrder = (order: any) => {
    console.log("Selected order:", order);
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.post("/product/detail/list", {
          page: 1,
          limit: 100,
        });

        setProducts(res.data.productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const closeModal = () => setEditIndex(null);

  const handleSave = async (updatedProduct: any) => {
    try {
      const current = products[editIndex!];
      await axiosInstance.put(`/product/update/${current._id}`, updatedProduct);
      const updatedList = [...products];
      updatedList[editIndex!] = { ...current, ...updatedProduct };
      setProducts(updatedList);
      closeModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/product/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-8 font-sans relative">
      {/* Header with Notifications and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your products and track sales</p>
        </div>

        <div className="flex items-center gap-4">
          <NotificationPanel onSelectOrder={handleSelectOrder} />
          <button
            className="bg-black text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/addproduct")}
          >
            + Add Product
          </button>
        </div>
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
            {products.filter((p) => p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-semibold">
            {products.reduce((a, b) => a + (b.sales || 0), 0)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-semibold">₨8,975,000</p>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="flex flex-col md:flex-row border border-black rounded-lg bg-white p-4 gap-6 items-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center md:w-1/5">
                <Image
                  src={prod.imageUrl || "/selloffer.png"}
                  alt={prod.productName}
                  width={100}
                  height={100}
                  className="h-24 w-24 object-cover rounded"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <h3 className="font-bold text-black text-xl mb-2">
                    {prod.productName}
                  </h3>
                  <p className="text-lg text-black font-semibold mb-1">
                    ₨{prod.price}
                  </p>
                  <p className="text-gray-700 mb-2">{prod.description}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Stock: {prod.stock}
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <Edit
                    className="w-6 h-6 cursor-pointer text-gray-600 hover:text-black"
                    onClick={() => setEditIndex(products.indexOf(prod))}
                  />
                  <Trash2
                    className="w-6 h-6 cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(prod._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editIndex !== null && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
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
                productName: products[editIndex].productName,
                description: products[editIndex].description,
                category: products[editIndex].category || "",
                stock: products[editIndex].stock,
                quantity: products[editIndex].quantity || 1,
                price: Number(products[editIndex].price),
              }}
              onCancel={closeModal}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
