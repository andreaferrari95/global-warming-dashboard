import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Button,
  Input,
} from "@heroui/react";
import { SearchIcon, LocateIcon } from "lucide-react";

import {
  fetchCoordinatesByCity,
  fetchCurrentWeather,
  fetch7DayForecast,
  WeatherbitForecastEntry,
} from "@/api/weather";

const DEFAULT_CITY = "Rome";

interface WeatherData {
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
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchWeather = async (cityQuery?: string, useGeolocation = false) => {
    setLoading(true);

    try {
      let lat: number | undefined;
      let lon: number | undefined;

      if (cityQuery) {
        ({ lat, lon } = await fetchCoordinatesByCity(cityQuery));
      } else if (useGeolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject),
          );

          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch {
          return fetchWeather(DEFAULT_CITY);
        }
      } else {
        return fetchWeather(DEFAULT_CITY);
      }

      if (lat === undefined || lon === undefined) {
        throw new Error("Missing coordinates.");
      }

      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetch7DayForecast(lat, lon),
      ]);

      setWeather({
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
      });
    } catch (err) {
      console.error("Weather load error:", err);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(undefined, true); // try geolocation on mount
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      fetchWeather(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">🌦️ Weather</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Search city..."
            size="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button isIconOnly size="sm" onClick={handleSearch}>
            <SearchIcon size={18} />
          </Button>
          <Button
            isIconOnly
            aria-label="Use my location"
            size="sm"
            variant="bordered"
            onClick={() => fetchWeather(undefined, true)}
          >
            <LocateIcon size={18} />
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {loading ? (
          <p>Loading...</p>
        ) : weather ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{weather.city}</h3>
                <p className="text-sm text-default-500">
                  {weather.current.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <img
                  alt="icon"
                  className="w-8 h-8"
                  src={`https://www.weatherbit.io/static/img/icons/${weather.current.icon}.png`}
                />
                {weather.current.temp}°C
              </div>
            </div>

            <div className="overflow-x-auto flex gap-4 pb-2">
              {weather.forecast.map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[70px]"
                >
                  <p className="text-xs">
                    {new Date(day.date).toLocaleDateString("default", {
                      weekday: "short",
                    })}
                  </p>
                  <img
                    alt="icon"
                    className="w-8 h-8"
                    src={`https://www.weatherbit.io/static/img/icons/${day.icon}.png`}
                  />
                  <p className="text-xs font-medium">{day.max}°</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Button size="sm" variant="bordered" onPress={onOpen}>
                Full Forecast
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-500">Failed to load weather data.</p>
        )}
      </CardBody>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="xl"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>7-Day Forecast – {weather?.city}</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {weather?.forecast.map((day, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex flex-col items-center"
                >
                  <p className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString("default", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <img
                    alt="icon"
                    className="w-10 h-10 my-2"
                    src={`https://www.weatherbit.io/static/img/icons/${day.icon}.png`}
                  />
                  <p className="text-sm">
                    🌡️ {day.min}° – {day.max}°
                  </p>
                </div>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
}
