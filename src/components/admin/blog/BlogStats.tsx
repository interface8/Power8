import {
  CheckCircle2,
  FileClock,
  FileText,
} from "lucide-react";

interface Props {
  total: number;
  published: number;
  drafts: number;
}

export default function BlogStats({
  total,
  published,
  drafts,
}: Props) {
  const stats = [
    {
      title: "Total Blogs",
      value: total,
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Published",
      value: published,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Drafts",
      value: drafts,
      icon: FileClock,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              rounded-3xl
              border
              bg-white
              p-5
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h3 className="mt-3 text-4xl font-bold">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl
                  ${stat.iconBg}
                `}
              >
                <Icon
                  className={`h-7 w-7 ${stat.iconColor}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}