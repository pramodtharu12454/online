"use client";
import axiosInstance from "@/lib/axios.instanse";
import { Box, Button, Chip, Typography } from "@mui/material";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

interface Product {
  _id: string;
  productName: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

const FilterSidebar = () => {
  const [category, setCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();
  const [sortBy, setSortBy] = useState<string>("recent");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartProductIds, setCartProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const router = useRouter();

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddToCart = async (id: string) => {
    if (cartProductIds.includes(id)) {
      alert("Product already in cart");
      return;
    }

    try {
      await axiosInstance.post(`/cart/item/add/${id}`);
      setCartProductIds((prev) => [...prev, id]);
      router.push("/cart");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
        alert((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const fetchDefaultProducts = async () => {
    setLoading(true);
    // setError(""); // Removed unused error state
    try {
      const res = await axiosInstance.get("/product/detail");
      setProducts(res.data);
    } catch (err) {
      // setError("Failed to fetch products"); // Removed unused error state
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultProducts();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/product/filter", {
        category,
        minPrice,
        maxPrice,
        sortBy,
      });
      setProducts(res.data);
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full mx-auto p-4">
      {/* Filter Sidebar */}
      <aside className="border border-black rounded-lg p-4 bg-white w-full md:w-64">
        <h3 className="font-bold mb-4 text-black">Categories</h3>
        <ul className="space-y-2 mb-6">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setCategory(cat)}
                className={`w-full text-left px-2 py-1 rounded border text-black ${
                  category === cat
                    ? "bg-gray-200 border-black"
                    : "border-gray-300"
                } hover:bg-gray-100`}
              >
                {cat}
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
              value={minPrice ?? ""}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-16 border border-black rounded px-2 py-1"
            />
            <span className="text-black">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice ?? ""}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-16 border border-black rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-black mb-2">Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-black rounded px-2 py-1 text-black"
          >
            <option value="recent">Recently Uploaded</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="w-full bg-black text-white py-2 rounded mt-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Apply Filter"}
        </button>
      </aside>

      {/* Product Section */}
      <section className="flex-1 w-full">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">
            Filter For more Products...
          </p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Filtered Products: {products.length}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <Box
                  key={product._id}
                  className="rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative cursor-pointer">
                    <Image
                      src={product.imageUrl || "/selloffer.png"}
                      alt={product.productName}
                      width={500}
                      height={300}
                      className="w-full h-[200px] object-cover hover:scale-105 transition-transform duration-300"
                      onClick={() =>
                        router.push(`/productdetail/${product._id}`)
                      }
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <Heart size={18} className="text-red-500" />
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-start p-4">
                    <div className="space-y-2 text-gray-800 flex-1">
                      <Typography
                        variant="h6"
                        className="font-bold text-lg truncate"
                      >
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

                  <div className="px-4 pb-4 mt-auto space-y-2">
                    <Button
                      fullWidth
                      onClick={() =>
                        router.push(`/productdetail/${product._id}`)
                      }
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
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </Box>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="!bg-black !text-white"
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`${
                      currentPage === i + 1
                        ? "!bg-blue-600 !text-white"
                        : "!bg-gray-200 !text-black"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="!bg-black !text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default FilterSidebar;
