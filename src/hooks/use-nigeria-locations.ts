"use client";

import { useEffect, useState } from "react";

const BASE_URL = "https://countriesnow.space/api/v0.1/countries";

export function useNigeriaLocations(state?: string) {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const [statesError, setStatesError] = useState("");
  const [citiesError, setCitiesError] = useState("");

  // Fetch Nigerian states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        setStatesError("");

        const res = await fetch(`${BASE_URL}/states`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Nigeria" }),
        });

        if (!res.ok) throw new Error("Failed to load states");

        const json = await res.json();

        // Response shape: { data: { states: [{ name: "Lagos", ... }] } }
        const stateList: string[] =
          json?.data?.states?.map((s: { name: string }) => s.name) ?? [];

        setStates(stateList.sort());
      } catch (error) {
        console.error(error);
        setStatesError(
          error instanceof Error ? error.message : "Unable to load states",
        );
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities whenever selected state changes
  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        setCitiesError("");

        const res = await fetch(`${BASE_URL}/state/cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Nigeria", state }),
        });

        if (!res.ok) throw new Error("Failed to load cities");

        const json = await res.json();

        // Response shape: { data: ["Lagos", "Ikeja", ...] }
        const cityList: string[] = Array.isArray(json?.data) ? json.data : [];

        setCities(cityList.sort());
      } catch (error) {
        console.error(error);
        setCitiesError(
          error instanceof Error ? error.message : "Unable to load cities",
        );
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [state]);

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    statesError,
    citiesError,
  };
}
