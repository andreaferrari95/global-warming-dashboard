import axios from "axios";

export interface MethaneEntry {
  date: string;
  average: string;
  trend: string;
  averageUnc: string;
  trendUnc: string;
}

interface MethaneApiResponse {
  methane: MethaneEntry[];
}

export async function getMethaneData(): Promise<MethaneEntry[]> {
  const res = await axios.get<MethaneApiResponse>(
    "https://global-warming.org/api/methane-api",
  );

  return res.data.methane;
}
