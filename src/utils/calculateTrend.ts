export interface TrendResult {
  percentage: string;
  positive: boolean;
}

export function calculateTrend(current: number, previous: number): TrendResult {
  if (previous === 0) {
    if (current === 0) {
      return {
        percentage: "0%",
        positive: true,
      };
    }

    return {
      percentage: "+100%",
      positive: true,
    };
  }

  const change = ((current - previous) / previous) * 100;

  return {
    percentage: `${change >= 0 ? "+" : ""}${Math.round(change)}%`,
    positive: change >= 0,
  };
}
