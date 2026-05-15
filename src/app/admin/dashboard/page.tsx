import DashboardStats from "@/components/admin/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="space-y-6 -mt-5">
      {/* Top */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, Administrator.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900 text-lg">
              Recent Orders
            </h2>

            <button className="text-sm text-orange-500 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    ORD-2026-00{item}
                  </p>

                  <p className="text-sm text-gray-500">
                    Customer Order
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₦45,000
                  </p>

                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 text-lg mb-6">
            Recent Activities
          </h2>

          <div className="space-y-5">
            {[
              "New product added",
              "User registered",
              "Order delivered",
              "Blog updated",
            ].map((activity) => (
              <div
                key={activity}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />

                <div>
                  <p className="text-sm text-gray-800">
                    {activity}
                  </p>

                  <p className="text-xs text-gray-500">
                    2 mins ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}