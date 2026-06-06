import { Blog } from "@/types/admin-blog";
import BlogTableRow from "./BlogTableRow";

interface Props {
  blogs: Blog[];
}

export default function BlogTable({ blogs }: Props) {
  return (
    <div
      className="
        hidden
        overflow-hidden
        rounded-2xl
        border
        bg-white
        lg:block
      "
    >
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">
              Title
            </th>

            <th className="px-6 py-4 text-left">
              Category
            </th>

            <th className="px-6 py-4 text-left">
              Author
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Created
            </th>

            <th className="px-6 py-4 text-left">
              Updated
            </th>

            <th className="px-6 py-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog) => (
            <BlogTableRow
              key={blog.id}
              blog={blog}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
