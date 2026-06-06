import { BlogStatus } from "@/types/admin-blog";

interface Props {
  status: BlogStatus;
}

export default function BlogStatusBadge({
  status,
}: Props) {
  const published =
    status === "published";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1
        text-xs
        font-medium

        ${
          published
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }
      `}
    >
      <span
        className="
          h-2
          w-2
          rounded-full
          bg-current
        "
      />

      {published ? "Published" : "Draft"}
    </span>
  );
}