import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  rating: string | number;
  quote: string;
  name: string;
  role: string;
  location: string;
  system: string;
  savings: string;
  imageUrl?: string;
  
}

export default function TestimonialCard({
  rating = 5,
  quote,
  name,
  role,
  location,
  imageUrl,
}: TestimonialCardProps) {
  return (
    <Card className="w-full max-w-[420px] h-full hover:shadow-xl transition-all duration-300 border border-[#F05700]/20 bg-white rounded-3xl overflow-hidden flex flex-col">
      <CardContent className="pt-10 pb-6 px-7 flex-1 flex flex-col">
        {/* Quote Icon + Stars */}
        <div className="flex mb-15">
          <Quote className="text-orange-200 w-9 h-9 shrink-0" />
          <div className="flex mt-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-6 h-6 ${
                  index < Number(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="text-gray-700 text-[16px] leading-relaxed mb-8 pb-5">
          {quote}
        </p>

        {/* Profile Section - stays at bottom */}
        <div className="flex items-center gap-4 mt-auto pb-7">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-orange-300">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={60}
                height={60}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-[#F05700] flex items-center justify-center text-white text-2xl font-semibold">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="leading-tight">
            <h4 className="font-semibold text-xl text-gray-900">{name}</h4>
            <p className="text-gray-600 text-lg">{role}</p>
            <p className="text-gray-500 text-sm">{location || "Location not specified"}</p>
          </div>
        </div>
      </CardContent>

     
    </Card>
  );
}