"use client";

import { BookOpen } from "lucide-react";

export default function BlogHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white py-10 sm:py-14 md:py-16 px-4 sm:px-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 shadow-lg">
          <BookOpen size={28} className="sm:hidden" />
          <BookOpen size={36} className="hidden sm:block" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Power 8 Blog
        </h1>
        <p className="mt-2 sm:mt-3 text-white/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Solar tips, industry news, product reviews and installation guides
        </p>
      </div>
    </div>
  );
}
