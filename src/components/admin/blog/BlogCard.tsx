import { Blog } from "@/types/admin-blog";

import BlogStatusBadge from "./BlogStatusBadge";
import BlogActions from "./BlogActions";

interface Props {
  blog: Blog;
}

export default function BlogCard({
  blog,
}: Props) {
  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
        lg:hidden
      "
    >
      <h3 className="font-medium">
        {blog.title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {blog.category}
      </p>

      <div className="mt-3">
        <BlogStatusBadge
          status={blog.status}
        />
      </div>

      <div className="mt-4">
        <BlogActions />
      </div>
    </div>
  );
}