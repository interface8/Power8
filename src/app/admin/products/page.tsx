import ProductsTable from "@/components/admin/dashboard/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>

          <p className="text-gray-500 mt-1">
            Manage all products in your store.
          </p>
        </div>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 h-11 rounded-xl font-medium">
          Add Product
        </button>
      </div>

      <ProductsTable />
    </div>
  );
}
