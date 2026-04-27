"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image - Full width on mobile, 90% on desktop */}
      <div className="relative h-[300px] md:h-[380px] bg-gray-100 rounded-xl overflow-hidden w-full md:w-[90%] md:mx-auto mb-4">
        <Image
          src={selectedImage}
          alt="Product image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails - Full width on mobile, 90% on desktop */}
      <div className="w-full md:w-[90%] md:mx-auto">
        <div className="flex gap-2 md:gap-3 justify-between">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative w-[22%] h-12 md:h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImage === image ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}