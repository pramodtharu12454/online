"use client";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  username?: string;
}

const Header = ({ username }: HeaderProps) => {
  const homeLink = username ? "/home" : "/";
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-300 border-b border-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Link href={homeLink}>
            <span className="text-2xl font-bold text-black cursor-pointer">
              Online Bazar
            </span>
          </Link>
        </div>

        {/* Middle: Search Bar - Hidden on small screens */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
          />
        </div>

        {/* Right: Icons and Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/cart" className="text-black hover:text-gray-700">
            <ShoppingCart className="h-6 w-6" />
          </Link>

          <Link
            href="/sellerDashboard"
            className="text-black font-medium hover:underline"
          >
            Become a Seller
          </Link>

          <Link
            href="/helpsupport"
            className="text-black font-medium hover:underline"
          >
            Help and Complain
          </Link>

          {username ? (
            <span className="text-black font-bold">{username}</span>
          ) : (
            <Link href="/login" className="text-black font-medium hover:underline">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-200 border-t border-black mt-2 px-4 pb-4 space-y-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border border-black rounded px-4 py-2 bg-white text-black focus:outline-none"
          />

          <Link href="/cart" className="block text-black hover:underline">
            🛒 Cart
          </Link>

          <Link href="/sellerDashboard" className="block text-black hover:underline">
            Become a Seller
          </Link>

          <Link href="/helpsupport" className="block text-black hover:underline">
            Help and Complain
          </Link>

          {username ? (
            <span className="block text-black font-bold">{username}</span>
          ) : (
            <Link href="/login" className="block text-black hover:underline">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
