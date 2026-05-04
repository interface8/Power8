"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "../providers/cart-providers";
import { useAuth } from "../providers/auth-provider";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cart, loading, updateCartItem, removeCartItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;
  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  const handleCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    router.push("/checkout");
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  //EMPTY CART
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-12 sm:pt-16">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-950 mb-6">
            Shopping Cart
          </h1>

          <div className="bg-white border rounded-xl py-18 px-6 flex flex-col items-center text-center shadow-sm">
            <ShoppingBag size={80} className="text-gray-400 mb-6" />

            <h2 className="text-xl font-semibold text-green-950 mb-4">
              Your cart is empty
            </h2>

            <p className="text-gray-600 mb-4">
              Add some products to get started
            </p>

            <Link
              href="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-sm font-medium transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-3 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-950 mb-6">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row gap-4 transition-all"
                >
                  {/* IMAGE */}
                  <div className="relative w-full sm:w-28 h-32 border rounded-lg overflow-hidden">
                    <Image
                      src={item.productImage || "/images/product-1.jpg"}
                      alt={item.productName || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-green-950">
                      {item.productName || "Unnamed Product"}
                    </h3>

                    <p className="text-orange-500 font-bold mt-1">
                      ₦{(item.price ?? 0).toLocaleString()}
                    </p>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        {/* MINUS */}
                        <button
                          onClick={async () => {
                            if (item.quantity <= 1) return;
                            setUpdatingId(item.id);
                            await updateCartItem(
                              item.id,
                              item.quantity - 1
                            );
                            setUpdatingId(null);
                          }}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="px-3 py-1 hover:bg-green-200 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-4 text-sm font-medium">
                          {item.quantity}
                        </span>

                        {/* PLUS */}
                        <button
                          onClick={async () => {
                            setUpdatingId(item.id);
                            await updateCartItem(
                              item.id,
                              item.quantity + 1
                            );
                            setUpdatingId(null);
                          }}
                          disabled={isUpdating}
                          className="px-3 py-1 hover:bg-green-200 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={async () => {
                          setUpdatingId(item.id);
                          await removeCartItem(item.id);
                          setUpdatingId(null);
                        }}
                        disabled={isUpdating}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="font-bold text-green-950 text-lg">
                    ₦{(item.subtotal ?? 0).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg  sm:rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 lg:sticky  lg:top-6">
              <h3 className="text-lg sm:text-xl font-bold text-green-950 mb-12">
                Order Summary
              </h3>

              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-700">
                <div className="flex justify-between">
                  <span className="text-xl font-light">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span>₦{vat.toLocaleString()}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-orange-600 text-xl">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CHECKOUT */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              {!user && (
                <p className="text-sm text-center mt-3 text-gray-500">
                  Please login to continue
                </p>
              )}
                  {/* Payment Options */}
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">
                  Payment Options
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Full Payment</li>
                  <li>✓ Pay Small Small (Installments)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;