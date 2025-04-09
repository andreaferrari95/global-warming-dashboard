import axios from "axios";

const POLAR_API_URL = "https://global-warming.org/api/arctic-api";

interface ArcticApiResponse {
  error: null | string;
  arcticData: {
    description: {
      title: string;
      basePeriod: string;
      units: string;
      annualMean: number;
      decadalTrend: number;
      missing: number;
    };
    data: {
      [key: string]: {
        value: number;
        anom: number;
        monthlyMean: number;
      };
    };
  };
}

export const getPolarIceData = async () => {
  const res = await axios.get<ArcticApiResponse>(POLAR_API_URL);

  if (res.data.error) {
    throw new Error("Error fetching polar ice data");
  }

  return res.data.arcticData;
};
