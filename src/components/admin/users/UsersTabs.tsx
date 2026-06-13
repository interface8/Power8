interface UserTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "orders", label: "Orders" },
  { id: "solarSystems", label: "Solar Systems" },
  { id: "creditAccounts", label: "Credit Accounts" },
  { id: "savings", label: "Savings" },
];

export function UserTabs({ activeTab, onTabChange }: UserTabsProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="flex gap-4 sm:gap-8 border-b border-gray-200 min-w-max sm:min-w-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 -left-2 -right-2 h-0.5 bg-orange-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}