import { Card, CardContent, CardFooter } from "../ui/card";
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
  system,
  savings,
  imageUrl,
}: TestimonialCardProps) {
  return (
    <Card className="w-full md:max-w-95  hover:shadow-xl transition-all duration-300 border border-[#F05700]/20 bg-white rounded-3xl overflow-hidden">
      <CardContent className="pt-8 pb-6 px-7">
        {/* Quote Icon + Stars */}
        <div className="flex  mb-15">
          <Quote className="text-orange-200 w-9 h-9 shrink-0" />
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-5 h-5 ${
                  index < Number(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="text-gray-700 text-[15.5px] leading-relaxed mb-8 min-h-30">
          {quote}
        </p>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-orange-300">
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
            <h4 className="font-semibold text-lg text-gray-900">{name}</h4>
            <p className="text-gray-600 text-sm">{role}</p>
            <p className="text-gray-500 text-xs">{location}</p>
          </div>
        </div>
      </CardContent>

      {/* Footer - System & Savings */}
      <CardFooter className="border-t border-orange-200 bg-white px-7 py-5 flex flex-col gap-3 text-sm">
        <div className="flex justify-between w-full">
          <span className="text-gray-500 font-medium">System:</span>
          <span className="font-medium text-gray-800">
            {system || "10kW Premium System"}
          </span>
        </div>
        <div className="flex justify-between w-full">
          <span className="text-gray-500 font-medium">Annual Savings:</span>
          <span className="font-semibold text-green-600">
            {savings || "₦850,000/year"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}