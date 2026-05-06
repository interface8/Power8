"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/cart-providers";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"full" | "installment">(
    "full",
  );

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
    0,
  );

  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-green-950 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment method */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-green-950 mb-4">
                Payment Method
              </h2>

              {/* Full Payment */}
              <div
                onClick={() => setPaymentMethod("full")}
                className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === "full"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-700" />
                  <span className="font-medium">Full Payment</span>
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>

                <p className="text-sm text-gray-600 max-w-xs">
                  Pay the full amount now and get your system installed
                  immediately
                </p>
              </div>

              {/* Installment */}
              <div
                onClick={() => setPaymentMethod("installment")}
                className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer mt-4 transition ${
                  paymentMethod === "installment"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-medium">Pay Small Small</span>
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                    Flexible
                  </span>
                </div>

                <p className="text-sm text-gray-600 max-w-xs">
                  Make a deposit and pay the rest in monthly installments
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-green-950 mb-6">
                Installation Address
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-700">
                    Street Address
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. 123 Main Street"
                    className="
        w-full mt-2 px-4 py-3
        bg-green-50 border border-gray-200
        rounded-lg text-sm
        transition-all duration-200
        focus:outline-none
        focus:ring-2 focus:ring-green-500
        focus:border-green-500
        hover:border-gray-300
      "
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos"
                      className="
          w-full mt-2 px-4 py-3
          bg-green-50 border border-gray-200
          rounded-lg text-sm
          transition-all duration-200
          focus:outline-none
          focus:ring-2 focus:ring-green-500
          focus:border-green-500
          hover:border-gray-300
        "
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos State"
                      className="
          w-full mt-2 px-4 py-3
          bg-green-50 border border-gray-200
          rounded-lg text-sm
          transition-all duration-200
          focus:outline-none
          focus:ring-2 focus:ring-green-500
          focus:border-green-500
          hover:border-gray-300
        "
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 800 000 0001"
                    className="
        w-full mt-2 px-4 py-3
        bg-green-50 border border-gray-200
        rounded-lg text-sm
        transition-all duration-200
        focus:outline-none
        focus:ring-2 focus:ring-green-500
        focus:border-green-500
        hover:border-gray-300
      "
                  />
                </div>
              </div>
            </div>
          </div>

          {/*  RIGHT */}
          <div className="bg-white rounded-xl border p-6 h-fit">
            <h2 className="text-lg font-semibold text-green-950 mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 text-sm text-gray-700">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>

                  <span>
                    ₦
                    {(
                      (item.price ?? 0) * (item.quantity ?? 0)
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>VAT (7.5%)</span>
                <span>₦{vat.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between text-lg font-bold text-green-950">
              <span>Total</span>
              <span className="text-orange-500">₦{total.toLocaleString()}</span>
            </div>

            {/* Buttons */}
            <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium transition">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
