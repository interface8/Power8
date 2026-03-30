import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  rating: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  system: string;
  savings: string;
  imageUrl?: string;
}

export default function TestimonialCard({
  rating,
  quote,
  name,
  role,
  location,
  system,
  savings,
  imageUrl,
}: TestimonialCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-[#F05700]/20 bg-white h-full flex flex-col">
      <CardContent className="p-4 sm:p-5 md:p-6 flex-1">
        {/* Quote and Stars Row */}
        <div className="flex items-center pb-16  mb-3 sm:mb-4 md:mb-5">
          <Quote className="text-orange-200 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0" />
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 ${index < Number(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Quote Text */}
        <p className="text-gray-600 font-normal mb-10 sm:mb-4 md:mb-5 text-lg sm:text-base md:text-lg">
          {quote}
        </p>

        {/* Customer Info */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden shrink-0 bg-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={70}
                height={70}
                className="object-cover w-full h-full"
              />
            ) : (
              name.charAt(0)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-base sm:text-lg md:text-xl text-gray-900 wrap-break-words">
              {name}
            </h4>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 wrap-break-words">
              {role}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 wrap-break-words">
              {location}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 sm:p-5 md:p-6 pt-3 sm:pt-4 md:pt-5 flex-col items-stretch gap-1.5 sm:gap-2 md:gap-3">
        <div className="text-sm sm:text-base md:text-lg flex justify-between items-center gap-2">
          <span className="text-gray-400 whitespace-nowrap">System:</span>
          <span className="font-medium text-right wrap-break-words">{system || "5kW Premium System"}</span>
        </div>
        <div className="text-sm sm:text-base md:text-lg text-green-600 flex justify-between items-center gap-2">
          <span className="text-gray-400 whitespace-nowrap">Annual Savings:</span>
          <span className="font-medium text-right wrap-break-words">{savings || "₦450,000/year"}</span>
        </div>
      </CardFooter>
    </Card>
  );
}