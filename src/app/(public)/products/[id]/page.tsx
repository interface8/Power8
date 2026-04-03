"use client";

import { useProductDetails } from "@/hooks/use-products";


export default function ProductDetailsPage({
    params}: { params: { id: string } }) {
        
    const { product, loading, error } = useProductDetails(params.id);

}