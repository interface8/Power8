// "use client";

// import { useRouter } from "next/navigation";
// import { useProductDetails } from "@/hooks/use-product-details";
// import { useTestimonialStats } from "@/hooks/use-testimonials";
// import { useCart } from "@/hooks/use-cart";
// import ProductDetails from "@/components/products/ProductDetails";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// export default function ProductDetailsPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const { product, loading, error } = useProductDetails(params.id);
//   const { stats, loading: statsLoading } = useTestimonialStats();
//   const { addToCart } = useCart();

// export default function ProductDetailsPage({
//     params}: { params: { id: string } }) {

//     const { product, loading, error } = useProductDetails(params.id);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;
//     if (!product) return <p>Product not found</p>;

//     return (
//       <div>
//         <h1>{product.name}</h1>
//         <p>{product.description}</p>
//         <p>Price: {product.price}</p>
//       </div>
//     );
// }


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