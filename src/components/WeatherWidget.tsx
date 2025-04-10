import { useEffect, useState } from "react";
import {
  Card,
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
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";

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
    description: string;
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
    fetchWeather(undefined, true);
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
    <>
      {/* Inline Mini Widget */}
      <Card className="bg-transparent shadow-none w-auto p-0 ml-auto border-2 border-default-200 rounded-xl px-3 py-2">
        <CardBody className="flex flex-col items-center text-center gap-2 p-0">
          <div className="text-sm">
            <p className="font-medium text-default-700">Weather</p>
            {loading ? (
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-4 w-[120px] rounded-md" />
                <Skeleton className="h-3 w-[100px] rounded-md" />
              </div>
            ) : weather ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${weather.city}-${weather.current.temp}`}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-semibold flex items-center justify-center gap-1"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {weather.city} – {weather.current.temp}°C
                    <motion.img
                      key={weather.current.icon}
                      alt="icon"
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline w-5 h-5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      src={`https://www.weatherbit.io/static/img/icons/${weather.current.icon}.png`}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-default-500">
                  {weather.current.description}
                </p>
              </>
            ) : (
              <p className="text-xs text-red-500">{errorMsg || "No data."}</p>
            )}
          </div>

          <Button
            className="text-xs font-medium bg-green-400 dark:bg-green-800 hover:scale-[1.03] cursor-pointer transition-all duration-200 "
            size="sm"
            variant="light"
            onPress={onOpen}
          >
            Forecast
          </Button>
        </CardBody>
      </Card>

      {/* Modal with Search + Forecast */}
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="xl"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader>7-Day Forecast – {weather?.city}</ModalHeader>
          <ModalBody>
            {/* Search & Geolocation Controls */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search city..."
                size="sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button isIconOnly size="sm" onPress={handleSearch}>
                <SearchIcon size={18} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="bordered"
                onPress={() => fetchWeather(undefined, true)}
              >
                <LocateIcon size={18} />
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="border-2 border-default-200 rounded-xl p-4 flex flex-col items-center gap-2"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : weather ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {weather.forecast.map((day, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-default-200 rounded-xl p-4 flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
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
                    <p className="text-sm text-default-500 mb-1">
                      {day.description}
                    </p>
                    <p className="text-sm">
                      🌡️ {day.min}° – {day.max}°
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500">{errorMsg || "No data."}</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
