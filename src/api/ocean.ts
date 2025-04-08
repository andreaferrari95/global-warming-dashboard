import axios from "axios";

export interface OceanDataEntry {
  year: string;
  anomaly: string;
}

interface OceanApiRawResponse {
  result: {
    [year: string]: { anomaly: string };
  };
}

export async function getOceanData(): Promise<OceanDataEntry[]> {
  try {
    const res = await axios.get<OceanApiRawResponse>(
      "https://global-warming.org/api/ocean-warming-api",
    );

    const raw = res.data.result;

    // ✅ Convert object to array
    const formatted: OceanDataEntry[] = Object.entries(raw).map(
      ([year, value]) => ({
        year,
        anomaly: value.anomaly,
      }),
    );

    return formatted;
  } catch (error) {
    console.error("Error fetching ocean data:", error);

    return [];
  }
}
