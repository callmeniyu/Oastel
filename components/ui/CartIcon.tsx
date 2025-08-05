"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { IoCartOutline } from "react-icons/io5";

const CartIcon = () => {
  const { itemCount, loading } = useCart();

  return (
    <Link href="/cart" className="relative">
      <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <IoCartOutline className="w-6 h-6 text-gray-700" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
