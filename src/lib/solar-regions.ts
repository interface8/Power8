export interface SolarRegion {
  city: string;
  state: string;
  peakSunHours: number;
}

const nigerianRegions: SolarRegion[] = [
  { city: "Lagos", state: "Lagos", peakSunHours: 4.5 },
  { city: "Abuja", state: "FCT", peakSunHours: 5.0 },
  { city: "Kano", state: "Kano", peakSunHours: 5.5 },
  { city: "Port Harcourt", state: "Rivers", peakSunHours: 4.2 },
  { city: "Enugu", state: "Enugu", peakSunHours: 4.8 },
  { city: "Jos", state: "Plateau", peakSunHours: 5.5 },
  { city: "Sokoto", state: "Sokoto", peakSunHours: 6.0 },
  { city: "Ibadan", state: "Oyo", peakSunHours: 4.6 },
  { city: "Kaduna", state: "Kaduna", peakSunHours: 5.3 },
  { city: "Benin City", state: "Edo", peakSunHours: 4.4 },
  { city: "Maiduguri", state: "Borno", peakSunHours: 6.0 },
  { city: "Warri", state: "Delta", peakSunHours: 4.3 },
  { city: "Calabar", state: "Cross River", peakSunHours: 4.1 },
  { city: "Owerri", state: "Imo", peakSunHours: 4.5 },
  { city: "Abeokuta", state: "Ogun", peakSunHours: 4.6 },
  { city: "Ilorin", state: "Kwara", peakSunHours: 5.0 },
  { city: "Uyo", state: "Akwa Ibom", peakSunHours: 4.2 },
  { city: "Yola", state: "Adamawa", peakSunHours: 5.8 },
  { city: "Bauchi", state: "Bauchi", peakSunHours: 5.6 },
  { city: "Makurdi", state: "Benue", peakSunHours: 5.0 },
];

export function getSunHours(city: string): number | null {
  const region = nigerianRegions.find(
    (r) => r.city.toLowerCase() === city.toLowerCase()
  );
  return region?.peakSunHours ?? null;
}

export function getAllRegions(): SolarRegion[] {
  return nigerianRegions;
}
