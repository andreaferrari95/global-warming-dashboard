import axios from "axios";

export interface Co2Entry {
  year: string;
  month: string;
  day: string;
  cycle: string;
  trend: string;
}

interface Co2ApiResponse {
  co2: Co2Entry[];
}

export async function getCo2Data(): Promise<Co2Entry[]> {
  try {
    const res = await axios.get<Co2ApiResponse>(
      "https://global-warming.org/api/co2-api",
    );

    return res.data.co2;
  } catch (error) {
    console.error("Failed to fetch CO₂ data:", error);

    return [];
  }
}
