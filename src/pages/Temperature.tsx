import { useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";

import HomeLayout from "@/layouts/home";
import { getTemperatureData } from "@/api/temperature";
import { getOceanData } from "@/api/ocean";

interface TemperatureEntry {
  time: string;
  station: string;
  land: number;
  ocean: string;
  label: string;
}

interface OceanEntry {
  label: string;
  anomaly: number;
}

export default function TemperaturesPage() {
  const [landData, setLandData] = useState<TemperatureEntry[]>([]);
  const [oceanData, setOceanData] = useState<OceanEntry[]>([]);
  const [type, setType] = useState<"land" | "ocean">("land");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null); // ✅ Chart ref for export

  const formatDateLabel = (decimalYear: string) => {
    const yearNum = parseInt(decimalYear);
    const decimal = parseFloat(decimalYear) - yearNum;
    const approxMonth = Math.round(decimal * 12);
    const date = new Date(yearNum, approxMonth);

    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const land = await getTemperatureData();
        const formattedLand = land.map((entry) => ({
          ...entry,
          label: formatDateLabel(entry.time),
          land: parseFloat(entry.land),
        }));

        const ocean = await getOceanData();
        const formattedOcean = ocean.map((entry) => ({
          label: entry.year,
          anomaly: parseFloat(entry.anomaly),
        }));

        setLandData(formattedLand);
        setOceanData(formattedOcean);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData =
    type === "land" ? landData.slice(-100) : oceanData.slice(-100);

  const latestValue =
    type === "land"
      ? (chartData.at(-1) as TemperatureEntry)?.land
      : ((chartData.at(-1) as OceanEntry)?.anomaly ?? null);

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");

      link.download = `temperature-chart-${type}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">🌡️ Global Temperature Data</h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner label="Loading temperature data..." size="lg" />
          </div>
        ) : (
          <Card className="p-6">
            {/* Title + Description + Latest Value */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {type === "land" ? "Land" : "Ocean"} Temperature Anomalies
                  (°C)
                </h2>
                <p className="text-sm text-default-500 mt-1 max-w-md">
                  This chart shows how global{" "}
                  {type === "land" ? "land" : "ocean"} temperatures have
                  deviated from long-term historical averages. Data is monthly
                  and anomalies are in °C.
                </p>
              </div>
              {latestValue !== null && (
                <div className="text-right">
                  <p className="text-xs text-default-500 mb-1">
                    Latest anomaly
                  </p>
                  <p
                    className={`text-base font-medium ${
                      type === "land" ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {latestValue.toFixed(3)}°C
                  </p>
                </div>
              )}
            </div>

            {/* Toggle + Export */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    type === "land"
                      ? "bg-green-600 text-white"
                      : "bg-default-100 text-default-700"
                  }`}
                  onClick={() => setType("land")}
                >
                  Land
                </button>
                <button
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    type === "ocean"
                      ? "bg-blue-700 text-white"
                      : "bg-default-100 text-default-700"
                  }`}
                  onClick={() => setType("ocean")}
                >
                  Ocean
                </button>
              </div>
              <Button
                size="sm"
                startContent={<DownloadIcon size={16} />}
                variant="bordered"
                onClick={handleExport}
              >
                Export PNG
              </Button>
            </div>

            {/* Chart */}
            <div ref={chartRef} className="h-[400px]">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="°C" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    labelStyle={{
                      color: "#374151",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  />
                  <Line
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                    dataKey={type === "land" ? "land" : "anomaly"}
                    dot={false}
                    isAnimationActive={true}
                    stroke={type === "land" ? "#10b981" : "#3b82f6"}
                    strokeWidth={3}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </HomeLayout>
  );
}
