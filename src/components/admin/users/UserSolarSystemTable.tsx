import { SolarSystemType } from "./utils";

interface UserSolarSystemsTableProps {
  solarSystems: SolarSystemType[];
}

export function UserSolarSystemsTable({ solarSystems }: UserSolarSystemsTableProps) {
  if (solarSystems.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No solar systems found
      </div>
    );
  }

  return (
    <div className="w-full min-w-112.5">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">DEVICE ID</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">BUNDLE</th>
            <th className="text-left pb-3 text-xs sm:text-sm font-medium text-gray-500">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {solarSystems.map((system) => (
            <tr key={system.id} className="border-b border-gray-50">
              <td className="py-3 text-xs sm:text-sm text-gray-600 truncate">{system.id}</td>
              <td className="py-3 text-xs sm:text-sm text-gray-600">{system.bundleName}</td>
              <td className="py-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                  {system.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}