import axios from "axios";

interface TemperatureResponse {
  result: {
    time: string;
    land: string;
    ocean: string;
    station: string;
  }[];
}

export async function getTemperatureData() {
  const response = await axios.get<TemperatureResponse>(
    "https://global-warming.org/api/temperature-api",
  );

  return response.data.result;
}
