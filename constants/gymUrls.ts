// URL mappings for each gym and event type
export const GYM_URLS = {
  "Capital Gymnastics - Cedar Park": {
    "OPEN GYM": "https://portal.iclasspro.com/capgymavery/camps/17?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymavery/camps/13?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/capgymavery/camps/7?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/capgymavery/camps",
  },
  "Capital Gymnastics - Pflugerville": {
    "OPEN GYM": "https://portal.iclasspro.com/capgymhp/camps/81?sortBy=name",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymhp/camps/2?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/capgymhp/camps/31?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/capgymhp/camps",
  },
  "Capital Gymnastics - Round Rock": {
    "OPEN GYM": "https://portal.iclasspro.com/capgymroundrock/camps/35?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymroundrock/camps/26?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/capgymroundrock/camps/28?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/capgymroundrock/camps",
  },
  "Rowland Ballard - Atascocita": {
    "OPEN GYM": "https://portal.iclasspro.com/rbatascocita/camps/76?sortBy=name",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/rbatascocita/camps/35?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/rbatascocita/camps/33?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/rbatascocita/camps",
  },
  "Rowland Ballard - Kingwood": {
    "OPEN GYM": "https://portal.iclasspro.com/rbkingwood/camps/6?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/rbkingwood/camps/26?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/rbkingwood/camps/31?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/rbkingwood/camps",
  },
  "Houston Gymnastics Academy": {
    "OPEN GYM": "https://portal.iclasspro.com/houstongymnastics/camps/15?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/houstongymnastics/camps/7?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/houstongymnastics/camps/2?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/houstongymnastics/camps",
  },
  "Estrella Gymnastics": {
    "OPEN GYM": "https://portal.iclasspro.com/estrellagymnastics/camps/99?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/estrellagymnastics/camps/3?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/estrellagymnastics/camps/24?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/estrellagymnastics/camps",
  },
  "Oasis Gymnastics": {
    "OPEN GYM": "https://portal.iclasspro.com/oasisgymnastics/camps/60?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/oasisgymnastics/camps/27?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/oasisgymnastics/camps/33?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/oasisgymnastics/camps",
  },
  "Scottsdale Gymnastics": {
    "OPEN GYM": "https://portal.iclasspro.com/scottsdalegymnastics/camps/88?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/scottsdalegymnastics/camps/32?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/scottsdalegymnastics/camps/28?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/scottsdalegymnastics/camps",
  },
  "Tigar Gymnastics": {
    "OPEN GYM": "https://portal.iclasspro.com/tigar/camps/22?sortBy=name",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/tigar/camps/8?sortBy=time",
    CLINIC: "https://portal.iclasspro.com/tigar/camps/2?sortBy=time",
    "Summer Camp": "https://portal.iclasspro.com/tigar/camps",
  },
} as const

export const getGymEventTypeUrl = (gymName: string, eventType: string): string => {
  const gymUrls = GYM_URLS[gymName as keyof typeof GYM_URLS]
  if (gymUrls && gymUrls[eventType as keyof typeof gymUrls]) {
    return gymUrls[eventType as keyof typeof gymUrls]
  }

  // Fallback to general gym booking page if specific URL not found
  const fallbackUrls: Record<string, string> = {
    "Capital Gymnastics - Cedar Park": "https://portal.iclasspro.com/capgymavery",
    "Capital Gymnastics - Pflugerville": "https://portal.iclasspro.com/capgymhp",
    "Capital Gymnastics - Round Rock": "https://portal.iclasspro.com/capgymroundrock",
    "Rowland Ballard - Atascocita": "https://portal.iclasspro.com/rbatascocita",
    "Rowland Ballard - Kingwood": "https://portal.iclasspro.com/rbkingwood",
    "Houston Gymnastics Academy": "https://portal.iclasspro.com/houstongymnastics",
    "Estrella Gymnastics": "https://portal.iclasspro.com/estrellagymnastics",
    "Oasis Gymnastics": "https://portal.iclasspro.com/oasisgymnastics",
    "Scottsdale Gymnastics": "https://portal.iclasspro.com/scottsdalegymnastics",
    "Tigar Gymnastics": "https://portal.iclasspro.com/tigar",
  }

  return fallbackUrls[gymName] || "#"
}
