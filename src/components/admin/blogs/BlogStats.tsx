"use client";

import { FileText, CheckCircle, Clock, FolderTree } from "lucide-react";

interface BlogStatsCardsProps {
  stats: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    categories: number;
  };
}

export function BlogStatsCards({ stats }: BlogStatsCardsProps) {
  const cards = [
    {
      label: "Total Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      label: "Published",
      value: stats.publishedBlogs,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      label: "Drafts",
      value: stats.draftBlogs,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FolderTree,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${card.bg}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
