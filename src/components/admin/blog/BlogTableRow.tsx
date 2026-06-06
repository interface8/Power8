import { Blog } from "@/types/admin-blog";
import BlogActions from "./BlogActions";
import BlogStatusBadge from "./BlogStatusBadge";

interface Props {
  blog: Blog;
}

export default function BlogTableRow({
  blog,
}: Props) {
  return (
    <tr className="border-b">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium">
            {blog.title}
          </p>

          <p className="text-xs text-gray-500">
            {blog.slug}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        {blog.category}
      </td>

      <td className="px-6 py-4">
        {blog.author}
      </td>

      <td className="px-6 py-4">
        <BlogStatusBadge
          status={blog.status}
        />
      </td>

      <td className="px-6 py-4">
        {blog.createdAt}
      </td>

      <td className="px-6 py-4">
        {blog.updatedAt}
      </td>

      <td className="px-6 py-4">
        <BlogActions />
      </td>
    </tr>
  );
}