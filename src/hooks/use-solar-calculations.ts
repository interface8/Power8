import { useQuery, useMutation } from "./use-api";
import { useEffect } from "react";

export interface SavedSolarCalculation {
  id: string;
  userId: string | null;
  appliances: unknown;
  config: unknown;
  results: unknown;
  location: string | null;
  totalDailyWh: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryAh: number;
  createdAt: string;
  updatedAt: string;
}

export function useSolarCalculations() {
  const { data, loading, error, refetch, clearError } = useQuery<{
    data: SavedSolarCalculation[];
  }>("/api/solar-calculations", {
    onError: (error) => {
      console.error("Failed to fetch solar calculations:", error);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  return {
    calculations: data?.data ?? [],
    loading,
    error,
    refetch,
    clearError,
  };
}

export function useSaveSolarCalculation() {
  const { mutate, loading, error, clearError } = useMutation<{
    data: SavedSolarCalculation;
  }>();

  const save = async (input: { appliances: unknown; config: unknown }) => {
    return mutate("/api/solar-calculations", input, "POST");
  };

  return {
    save,
    loading,
    error,
    clearError,
  };
}
