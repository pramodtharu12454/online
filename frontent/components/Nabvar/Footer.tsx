"use client";
import React, { useState } from "react";

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    name: "Pramod Tharu",
    email: "tharupramod406@gmail.com",
    phone: "9815442325",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Complaint Submitted:", formData);
    alert("Your complaint has been submitted!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Help & Complain</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="border border-gray-300 p-4 rounded-md shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-3">Your Information</h2>
            <p>
              <strong>Name:</strong> Pramod Tharu
            </p>
            <p>
              <strong>Contact:</strong> 9815442325
            </p>
            <p>
              <strong>Email:</strong> tharupramod406@gmail.com
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://pramodtharu.vercel.app"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                pramodtharu.vercel.app
              </a>
            </p>
          </div>

          {/* Rules */}
          <div className="border border-gray-300 p-4 rounded-md shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-3">E-Commerce Rules</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>All products are subject to availability.</li>
              <li>Returns accepted within 7 days of delivery.</li>
              <li>Valid contact info must be provided.</li>
              <li>Complaints must be submitted within 3 days of delivery.</li>
              <li>We respect your privacy and ensure secure transactions.</li>
              <li>Offers are time-limited and may expire without notice.</li>
              <li>Delivery time may vary based on product and location.</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Complaint Form */}
        <div className="border border-gray-300 p-4 rounded-md shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Submit a Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your complaint here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
