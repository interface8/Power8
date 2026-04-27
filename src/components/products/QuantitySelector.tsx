"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  stockQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({ stockQuantity, onQuantityChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < stockQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= stockQuantity) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quantity
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center transition ${
            quantity <= 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          -
        </button>

        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 h-8 sm:w-20 sm:h-10 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          min={1}
          max={stockQuantity}
        />

        <button
          onClick={increaseQuantity}
          disabled={quantity >= stockQuantity}
          className={`w-8 h-8 sm:w-10 sm:h-10 border rounded-lg flex items-center justify-center transition ${
            quantity >= stockQuantity
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          +
        </button>

        <span className="text-xs sm:text-sm text-gray-500 ml-2">
          {stockQuantity} available
        </span>
      </div>
    </div>
  );
}