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

import { getCachedWeather } from "@/utils/useCachedWeather";

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
  const [errorMsg, setErrorMsg] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchWeather = async (cityQuery?: string, useGeolocation = false) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await getCachedWeather(
        cityQuery ? cityQuery : useGeolocation ? undefined : DEFAULT_CITY,
      );

      setWeather(data);
    } catch (err) {
      console.error("Weather API error:", err);
      setWeather(null);
      setErrorMsg("⚠️ Weather service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(undefined, true); // Try geolocation on mount
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
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">🌦️ Weather</h2>
        <div className="flex gap-2">
          <Input
            aria-label="Search city"
            placeholder="Search city..."
            size="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            isIconOnly
            isDisabled={loading}
            size="sm"
            onPress={handleSearch}
          >
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
          <div className="flex justify-between items-center">
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
            <Button size="sm" variant="bordered" onPress={onOpen}>
              Full Forecast
            </Button>
          </div>
        ) : (
          <p className="text-sm text-red-500">{errorMsg || "No data."}</p>
        )}
      </CardBody>

      {/* Modal for full forecast */}
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
