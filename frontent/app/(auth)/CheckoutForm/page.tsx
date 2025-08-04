
import CheckoutForm from "@/components/ui/CheckoutForm";
import React from "react";

// Example: Import your cart context or define cartItems here
// import { useCart } from "@/context/CartContext";

const CheckoutFormpage = () => {
  // Replace this with your actual cart items retrieval logic
  // const { cartItems } = useCart();
  const cartItems: any[] = []; // TODO: Replace with actual cart items

  return <div><CheckoutForm cartItems={cartItems} /></div>;
};

export default CheckoutFormpage;
