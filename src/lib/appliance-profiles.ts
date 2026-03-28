export interface ApplianceProfile {
  category: string;
  keywords: RegExp;
  defaultSurgeMultiplier: number;
  defaultHoursPerDay: number;
}

const applianceProfiles: ApplianceProfile[] = [
  {
    category: "Refrigerator",
    keywords: /fridge|refrigerator|freezer/i,
    defaultSurgeMultiplier: 3,
    defaultHoursPerDay: 14,
  },
  {
    category: "Air Conditioner",
    keywords: /air\s*conditioner|split\s*unit|cooling\s*system/i,
    defaultSurgeMultiplier: 3.5,
    defaultHoursPerDay: 8,
  },
  {
    category: "TV",
    keywords: /television|lcd|led\s*tv|plasma|smart\s*tv/i,
    defaultSurgeMultiplier: 1,
    defaultHoursPerDay: 5,
  },
  {
    category: "Pump",
    keywords: /pump|water\s*pump|borehole|submersible/i,
    defaultSurgeMultiplier: 4,
    defaultHoursPerDay: 4,
  },
  {
    category: "Fan",
    keywords: /ceiling\s*fan|standing\s*fan|table\s*fan|exhaust\s*fan/i,
    defaultSurgeMultiplier: 1.5,
    defaultHoursPerDay: 10,
  },
  {
    category: "Lighting",
    keywords: /bulb|light|lamp|led\s*bulb|fluorescent/i,
    defaultSurgeMultiplier: 1,
    defaultHoursPerDay: 6,
  },
  {
    category: "Iron",
    keywords: /iron|pressing\s*iron|steam\s*iron/i,
    defaultSurgeMultiplier: 1,
    defaultHoursPerDay: 1,
  },
  {
    category: "Microwave",
    keywords: /microwave|oven/i,
    defaultSurgeMultiplier: 2,
    defaultHoursPerDay: 0.5,
  },
  {
    category: "Washer",
    keywords: /washing\s*machine|washer|laundry/i,
    defaultSurgeMultiplier: 3,
    defaultHoursPerDay: 1,
  },
  {
    category: "Computer",
    keywords: /computer|desktop|monitor|laptop/i,
    defaultSurgeMultiplier: 1.2,
    defaultHoursPerDay: 8,
  },
  {
    category: "Network",
    keywords: /router|modem|wifi|switch|access\s*point/i,
    defaultSurgeMultiplier: 1,
    defaultHoursPerDay: 24,
  },
  {
    category: "Charger",
    keywords: /phone\s*charger|charger|power\s*bank/i,
    defaultSurgeMultiplier: 1,
    defaultHoursPerDay: 3,
  },
];

export function detectCategory(text: string): ApplianceProfile | null {
  for (const profile of applianceProfiles) {
    if (profile.keywords.test(text)) {
      return profile;
    }
  }
  return null;
}

export function getAllProfiles(): ApplianceProfile[] {
  return applianceProfiles;
}
