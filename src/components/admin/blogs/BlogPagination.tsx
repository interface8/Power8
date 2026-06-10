export default function BlogPagination() {
  return (
    <div className="flex justify-center gap-2">
      <button className="rounded border px-3 py-2">
        Previous
      </button>

      <button className="rounded border px-3 py-2">
        1
      </button>

      <button className="rounded border px-3 py-2">
        2
      </button>

      <button className="rounded border px-3 py-2">
        Next
      </button>
    </div>
  );
}