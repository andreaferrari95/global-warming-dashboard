import {
  fetchCoordinatesByCity,
  fetchCurrentWeather,
  fetch7DayForecast,
  WeatherbitForecastEntry,
} from "@/api/weather";

const CACHE_TTL_MS = 1000 * 60 * 60;
const DEFAULT_CITY = "Rome";

interface CachedWeatherData {
  timestamp: number;
  data: {
    city: string;
    current: {
      temp: number;
      description: string;
      icon: string;
    };
    forecast: {
      date: string;
      min: number;
      max: number;
      icon: string;
    }[];
  };
}

export async function getCachedWeather(
  city?: string,
): Promise<CachedWeatherData["data"]> {
  const cacheKey = `weather-${city ?? "current"}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed: CachedWeatherData = JSON.parse(cached);

      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  let lat: number, lon: number;

  try {
    if (city) {
      ({ lat, lon } = await fetchCoordinatesByCity(city));
    } else {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );

      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    }
  } catch {
    ({ lat, lon } = await fetchCoordinatesByCity(DEFAULT_CITY));
  }

  const [current, forecast] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetch7DayForecast(lat, lon),
  ]);

  const result: CachedWeatherData["data"] = {
    city: current.city_name,
    current: {
      temp: current.temp,
      description: current.weather.description,
      icon: current.weather.icon,
    },
    forecast: forecast.map((d: WeatherbitForecastEntry) => ({
      date: d.valid_date,
      min: d.min_temp,
      max: d.max_temp,
      icon: d.weather.icon,
    })),
  };

  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      timestamp: Date.now(),
      data: result,
    }),
  );

  return result;
}
