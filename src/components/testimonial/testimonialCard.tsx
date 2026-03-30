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
    <Card
      className="hover:shadow-xl transition-all duration-300 border border-[#F05700]/20 px-8 mx-2 bg-white"
     
    >
      <CardContent className="pt-6 ">
       <div className="flex items-center pr-3 mb-4">
  <Quote className="text-orange-200 w-12 h-12" />
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        className={`w-7 h-7 ${index < Number(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ))}
    {/* <span className="ml-2 text-sm text-gray-500">({rating})</span> */}
  </div>
</div>
        <p className="text-gray-600 font-normal mb-4 text-[16px] pt-16 pb-12">
          {quote}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-18 h-18 rounded-full overflow-hidden shrink-0 mb-4">
             {imageUrl ? (
    <Image
      src={imageUrl}
      alt={name}
      width={50}
      height={50}
      className="object-cover w-full h-full"
    />
  ) : (
    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
      {name.charAt(0)}
    </div>
  )}
          </div>

          <div>
            <h4 className="font-semibold text-2xl text-gray-900">{name}</h4>
            <p className="text-lg text-gray-600">{role}</p>
            <p className="text-base text-gray-500">{location}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex-col items-start gap-2 mt-4 mb-16 ">
        <div className="text-lg font-bold flex flex-row items-center justify-between w-full">
          <span className="font-normal text-gray-400">System:</span>
          <div>{system || "5kW Premium System"}</div>
        </div>
        <div className="text-lg font-bold text-green-600 flex flex-row items-center justify-between w-full">
          <span className="font-normal text-gray-400">Annual Savings:</span>
          <div>{savings || "₦450,000/year"}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
