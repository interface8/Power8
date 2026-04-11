"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

const CartIcon = () => {
  const items = useSelector((state: RootState) => state.cart.items);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="relative inline-block">
      <ShoppingCart className="w-6 h-6 text-gray-700" />

      {/* Badge */}
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] sm:text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
