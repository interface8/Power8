// "use client";

// import { useEffect, useState } from "react";
// import ProductCard from "./ProductCard";
// import { Product } from "@/types/products";
// import { getProducts } from "@/modules/products";

// const ProductList = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await getProducts();

//         setProducts(data.data ?? data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProducts();
//   }, []);

//   if(loading) {
//     return <p className="text-center py-10">Loading products...</p>
//   }

//   return (
//     <div className="grid gap-6 p sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product}/>
//       ))}
//     </div>
//   )
// };

// export default ProductList

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/products";

const products: Product[] = [
  {
    id: "1",
    name: "Monocrystalline Solar Panel 300W",
    imageUrl: "/images/product-1.jpg",
    price: 45000,
    stockQuantity: 50,
    description:
      "High-efficiency monocrystalline solar panel with excellent low-light performance",
    categoryName: "Panel",
    power: "300W",
    warranty: 25,
  },
  {
    id: "2",
    name: "Monocrystalline Solar Panel 350W",
    imageUrl: "/images/product-2.jpg",
    price: 52000,
    stockQuantity: 40,
    description: "Premium monocrystalline panel with higher efficiency rating",
    categoryName: "Panel",
    power: "350W",
    warranty: 25,
  },
  {
    id: "3",
    name: "Polycrystalline Solar Panel 250W",
    imageUrl: "/images/product-3.jpg",
    price: 35000,
    stockQuantity: 60,
    description:
      "Cost-effective polycrystalline panel for budget-conscious buyers",
    categoryName: "Panel",
    power: "250W",
    warranty: 20,
  },
  {
    id: "4",
    name: "Pure Sine Wave Inverter 1000W",
    imageUrl: "/images/product-4.jpg",
    price: 65000,
    stockQuantity: 30,
    description: "Compact inverter suitable for small home applications",
    categoryName: "inverter",
    power: "1000W",
    warranty: 2,
  },
  {
    id: "5",
    name: "Pure Sine Wave Inverter 2000W",
    imageUrl: "/images/product-5.jpg",
    price: 95000,
    stockQuantity: 25,
    description: "Mid-range inverter for medium-sized homes",
    categoryName: "inverter",
    power: "2000W",
    warranty: 2,
  },
  {
    id: "6",
    name: "Pure Sine Wave Inverter 3500W",
    imageUrl: "/images/product-6.jpg",
    price: 145000,
    stockQuantity: 20,
    description: "Heavy-duty inverter for larger homes and offices",
    categoryName: "inverter",
    power: "3500W",
    warranty: 3,
  },
  {
    id: "7",
    name: "Hybrid Inverter 5000W",
    imageUrl: "/images/product-7.jpg",
    price: 220000,
    stockQuantity: 15,
    description:
      "Premium hybrid inverter with grid-tie capability and smart features",
    categoryName: "Inverter",
    power: "5000W",
    warranty: 5,
  },
  {
    id: "8",
    name: "Deep Cycle Battery 100Ah",
    imageUrl: "/images/product-8.jpg",
    price: 55000,
    stockQuantity: 35,
    description: "Reliable deep cycle battery for solar energy storage",
    categoryName: "Battery",
    capacity: "100Ah",
    warranty: 1,
  },
  {
    id: "9",
    name: "Deep Cycle Battery 150Ah",
    imageUrl: "/images/product-9.jpg",
    price: 78000,
    stockQuantity: 30,
    description: "Higher capacity battery for extended backup time",
    categoryName: "Battery",
    capacity: "100Ah",
    warranty: 1,
  },
  {
    id: "10",
    name: "Tubular Battery 200Ah",
    imageUrl: "/images/product-10.png",
    price: 105000,
    stockQuantity: 25,
    description: "Long-lasting tubular battery with excellent cycle life",
    categoryName: "Battery",
    capacity: "200Ah",
    warranty: 2,
  },
  {
    id: "11",
    name: "Lithium LiFePO4 Battery 100Ah",
    imageUrl: "/images/product-15.jpg",
    price: 185000,
    stockQuantity: 15,
    description:
      "Premium lithium battery with superior performance and longevity",
    categoryName: "Battery",
    capacity: "100Ah",
    warranty: 5,
  },
  {
    id: "12",
    name: "MPPT Charge Controller 30A",
    imageUrl: "/images/product-11.jpg",
    price: 28000,
    stockQuantity: 40,
    description:
      "Maximum Power Point Tracking charge controller for optimal efficiency",
    categoryName: "Accessory",
    capacity: "30A",
    warranty: 2,
  },
  {
    id: "13",
    name: "MPPT Charge Controller 60A",
    imageUrl: "/images/product-12.jpg",
    price: 48000,
    stockQuantity: 30,
    description: "High-capacity MPPT controller for larger solar arrays",
    categoryName: "Accessory",
    capacity: "60A",
    warranty: 3,
  },
  {
    id: "14",
    name: "Solar Panel Mounting Kit",
    imageUrl: "/images/product-13.jpg",
    price: 15000,
    stockQuantity: 50,
    description: "Complete mounting hardware for secure panel installation",
    categoryName: "Accessory",
    power: "",
    warranty: 5,
  },
  {
    id: "15",
    name: "Solar Cable Set 10m",
    imageUrl: "/images/product-14.png",
    price: 8000,
    stockQuantity: 60,
    description: "UV-resistant solar cables with MC4 connectors",
    categoryName: "Accessory",
    capacity: "4mm²",
    warranty: 1,
  },
];

const ProductList = () => {
  return (
    <div className="p-4">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
