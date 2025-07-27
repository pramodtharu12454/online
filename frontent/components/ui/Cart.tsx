"use client";
import React, { useState } from "react";
import Image from "next/image";

const Cart = () => {
  const [quantityWatch, setQuantityWatch] = useState(2);
  const [quantityPhone, setQuantityPhone] = useState(1);

  const phonePrice = 120000;
  const watchPrice = 25000;

  const totalPrice = phonePrice * quantityPhone + watchPrice * quantityWatch;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* Product Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* iPhone */}
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/iphone.jpg"
                alt="iPhone"
                width={80}
                height={80}
                className="rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">iPhone 15 Pro Max</h2>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                  Electronics
                </span>
                <div className="mt-2">
                  <p className="text-xl font-bold">
                    Rs{phonePrice.toLocaleString()}{" "}
                    <span className="line-through text-gray-500 text-sm">
                      Rs135,000
                    </span>
                  </p>
                  <p className="text-green-600 text-sm">You save Rs15,000</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border px-2 py-1 rounded">
                <button
                  onClick={() =>
                    setQuantityPhone(Math.max(1, quantityPhone - 1))
                  }
                >
                  −
                </button>
                <span className="px-2">{quantityPhone}</span>
                <button onClick={() => setQuantityPhone(quantityPhone + 1)}>
                  +
                </button>
              </div>
              <p className="text-sm">
                Subtotal: Rs{(phonePrice * quantityPhone).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Watch */}
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/watch.jpg"
                alt="Watch"
                width={80}
                height={80}
                className="rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">Samsung Galaxy Watch</h2>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                  Electronics
                </span>
                <div className="mt-2">
                  <p className="text-xl font-bold">
                    Rs{watchPrice.toLocaleString()}{" "}
                    <span className="line-through text-gray-500 text-sm">
                      Rs30,000
                    </span>
                  </p>
                  <p className="text-green-600 text-sm">You save Rs5,000</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border px-2 py-1 rounded">
                <button
                  onClick={() =>
                    setQuantityWatch(Math.max(1, quantityWatch - 1))
                  }
                >
                  −
                </button>
                <span className="px-2">{quantityWatch}</span>
                <button onClick={() => setQuantityWatch(quantityWatch + 1)}>
                  +
                </button>
              </div>
              <p className="text-sm">
                Subtotal: Rs{(watchPrice * quantityWatch).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary Section */}
        <div className="space-y-6">
          {/* Coupon */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Coupon Code</h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-2"
              placeholder="Enter coupon code"
            />
            <button className="bg-black text-white w-full py-2 rounded">
              Apply
            </button>
            <p className="text-sm mt-2 text-gray-500">
              Try: SAVE10 or WELCOME20
            </p>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal ({quantityPhone + quantityWatch} items)</span>
              <span>Rs{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>You Save</span>
              <span>-Rs25,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span className="text-green-500">FREE</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>Rs{totalPrice.toLocaleString()}</span>
            </div>
            <button className="w-full bg-black text-white py-2 mt-4 rounded">
              Proceed to Checkout
            </button>
            <button className="w-full border mt-2 py-2 rounded">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
