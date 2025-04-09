const API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;
const BASE_URL = "https://api.weatherbit.io/v2.0";

export interface WeatherbitForecastEntry {
  valid_date: string;
  min_temp: number;
  max_temp: number;
  weather: { icon: string };
}

export async function fetchCoordinatesByCity(city: string) {
  const res = await fetch(`${BASE_URL}/current?city=${city}&key=${API_KEY}`);
  const data = await res.json();

  return {
    lat: data.data[0].lat,
    lon: data.data[0].lon,
  };
}

export async function fetchCurrentWeather(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/current?lat=${lat}&lon=${lon}&key=${API_KEY}`,
  );
  const data = await res.json();

  return data.data[0];
}

export async function fetch7DayForecast(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/forecast/daily?lat=${lat}&lon=${lon}&days=7&key=${API_KEY}`,
  );
  const data = await res.json();

  return data.data;
}
