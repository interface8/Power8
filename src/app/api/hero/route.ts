import { NextResponse } from "next/server";

export async function GET() {
  const slides = [
    {
      image: "/images/power-2.jpg",
      title: "Advanced Technology",
      description: "State-of-the-art solar energy system",
    },
    {
      image: "/images/power-1.jpg",
      title: "Professional Installation",
      description: "Expert solar panel installation for your home",
    },
    {
      image: "/images/power-7.jpg",
      title: "Power Your Household",
      description: "Reliable Energy for your household",
    },
  ];

  return NextResponse.json(slides);
}
