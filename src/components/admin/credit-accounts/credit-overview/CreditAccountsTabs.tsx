import { CreditStatus } from "@/types/credit-account";

type Filter =
  | "ALL"
  | CreditStatus;

interface Props {
  activeFilter: Filter;
  onChange: (filter: Filter) => void;
}

const filters: Filter[] = [
  "ALL",
  "ACTIVE",
  "COMPLETED",
  "DEFAULTED",
];

export default function CreditAccountsTabs({
  activeFilter,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-8 border-b border-gray-200 px-6">
      {filters.map((filter) => {
        const isActive =
          activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() =>
              onChange(filter)
            }
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              isActive
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {filter.charAt(0) +
              filter
                .slice(1)
                .toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}