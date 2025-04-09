import axios from "axios";

export interface NitrousEntry {
  date: string;
  average: string;
  trend: string;
  averageUnc: string;
  trendUnc: string;
}

interface NitrousApiResponse {
  nitrous: NitrousEntry[];
}

export const getNitrousData = async (): Promise<NitrousEntry[]> => {
  const res = await axios.get(
    "https://global-warming.org/api/nitrous-oxide-api",
  );
  const data = res.data as NitrousApiResponse; // ✅ safely cast to known shape

  return data.nitrous;
};
