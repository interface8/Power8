interface StatsSummaryProps {
  stats: { totalTestimonials: number; averageRating: number };
  loading: boolean;
  error: string;
}

export default function StatsSummary({ stats, loading, error }: StatsSummaryProps) {
  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="text-center py-6 md:py-8 rounded-xl shadow-xs border border-[#F05700]/10 bg-white max-w-100">
      <div className="w-24 h-8 sm:w-32 sm:h-10 bg-gray-200 rounded animate-pulse mx-auto mb-6 lg:w-40 lg:h-12"></div>
      <div className="w-20 h-4 sm:w-24 sm:h-5 bg-gray-200 rounded animate-pulse mx-auto"></div>
    </div>
  );

  if (error) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="col-span-full text-center text-red-500">
          Failed to load stats. Please try again later.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Happy Customers */}
      <div className="text-center py-6 md:py-8 rounded-xl shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#F05700]/10 bg-white max-w-100">
        <div className="text-3xl sm:text-4xl font-bold mb-6 lg:text-5xl tracking-widest text-orange-600">
          {stats.totalTestimonials}
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-normal lg:text-xl pt-6">
          Happy Customers
        </div>
      </div>

      {/* System installed */}
      <div className="text-center py-6 md:py-8 rounded-xl shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#F05700]/10 bg-white max-w-100">
        <div className="text-3xl sm:text-4xl font-semibold mb-6 lg:text-5xl tracking-widest text-orange-600">
          0
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-normal lg:text-xl pt-6">
          System installed
        </div>
      </div>

      {/* Total Savings */}
      <div className="text-center py-6 md:py-8 rounded-xl shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#F05700]/10 bg-white max-w-100">
        <div className="text-3xl sm:text-4xl font-semibold mb-6 lg:text-5xl text-orange-600">
          ₦2.8B+
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-normal lg:text-xl pt-6">
          Total Savings
        </div>
      </div>

      {/* Customer Satisfaction - uses averageRating */}
      <div className="text-center py-6 md:py-8 rounded-xl shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#F05700]/10 bg-white max-w-100">
        <div className="text-4xl sm:text-4xl font-semibold mb-6 lg:text-5xl tracking-widest text-orange-600">
          {stats.averageRating?.toFixed(1) ?? 0}
        </div>
        <div className="text-sm sm:text-base text-gray-500 font-normal lg:text-xl pt-6">
          Customer Satisfaction
        </div>
      </div>
    </div>
  );
}