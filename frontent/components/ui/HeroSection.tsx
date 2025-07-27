"use client";
import React, { useEffect, useRef, useState } from "react";

const backgroundImages = [
  "/addtocart.jpg", // Replace with your actual image paths
  "/online shopping.jpg",
  "/e-commerce.jpg",
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty("--x", `${x}px`);
      container.style.setProperty("--y", `${y}px`);
    };

    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative text-white p-10 w-330 rounded-3xl mb-10 text-center bg-cover bg-center transition-all duration-1000 border-2"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.8)), url(${backgroundImages[currentIndex]})`,
        borderImage: `radial-gradient(
          circle at var(--x, 50%) var(--y, 50%),
          #00ffff 0%, transparent 70%
        ) 1`,
        borderImageSlice: 1,
      }}
    >
      <h2 className="text-3xl font-bold mb-2">Big Sale Today!</h2>
      <p className="mb-4">Up to 50% off on selected items</p>
      <button className="bg-white text-slate-900 font-semibold px-10 py-2 rounded">
        Shop Now
      </button>
    </div>
  );
};

export default HeroSection;
