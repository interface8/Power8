"use client";

import { useProductDetails } from "@/hooks/use-products";


export default function ProductDetailsPage({
    params}: { params: { id: string } }) {

    const { product, loading, error } = useProductDetails(params.id);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>Product not found</p>;

    return (
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: {product.price}</p>
      </div>
    );
}