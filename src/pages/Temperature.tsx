import { useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
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
import jsPDF from "jspdf";

import HomeLayout from "@/layouts/home";
import { getTemperatureData } from "@/api/temperature";
import { getOceanData } from "@/api/ocean";

interface TemperatureEntry {
  time: string;
  station: string;
  land: number;
  ocean: string;
  label: string;
  year: number;
}

interface OceanEntry {
  label: string;
  anomaly: number;
  year: number;
}

export default function TemperaturesPage() {
  const [landData, setLandData] = useState<TemperatureEntry[]>([]);
  const [oceanData, setOceanData] = useState<OceanEntry[]>([]);
  const [type, setType] = useState<"land" | "ocean">("land");
  const [startYear, setStartYear] = useState(1950);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const formatDateLabel = (decimalYear: string) => {
    const yearNum = parseInt(decimalYear);
    const decimal = parseFloat(decimalYear) - yearNum;
    const approxMonth = Math.round(decimal * 12);
    const date = new Date(yearNum, approxMonth);

    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const land = await getTemperatureData();
        const formattedLand = land.map((entry) => {
          const year = Math.floor(parseFloat(entry.time));

          return {
            ...entry,
            year,
            label: formatDateLabel(entry.time),
            land: parseFloat(entry.land),
          };
        });

        const ocean = await getOceanData();
        const formattedOcean = ocean.map((entry) => {
          const year = parseInt(entry.year);

          return {
            label: entry.year,
            year,
            anomaly: parseFloat(entry.anomaly),
          };
        });

        setLandData(formattedLand);
        setOceanData(formattedOcean);
      } catch (err) {
        console.error("Error fetching temperature data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered data based on year
  const data = type === "land" ? landData : oceanData;
  const filteredData = data.filter((entry) => entry.year >= startYear);

  const latest = filteredData.at(-1);
  const latestLabel = latest?.label;
  const latestValue =
    type === "land"
      ? (latest as TemperatureEntry)?.land
      : (latest as OceanEntry)?.anomaly;

  // Calculate Y-axis range dynamically
  const values = filteredData.map((entry) =>
    type === "land"
      ? (entry as TemperatureEntry).land
      : (entry as OceanEntry).anomaly,
  );
  const yMin = Math.floor(Math.min(...values) * 10) / 10;
  const yMax = Math.ceil(Math.max(...values) * 10) / 10;

  const handleExport = async (format: "png" | "pdf") => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    if (format === "png") {
      const link = document.createElement("a");

      link.download = `temperature-${type}-${startYear}.png`;
      link.href = imgData;
      link.click();
    } else {
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`temperature-${type}-${startYear}.pdf`);
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
            {/* Description + Dropdowns */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {type === "land" ? "Land" : "Ocean"} Temperature Anomalies
                  (°C)
                </h2>
                <p className="text-sm text-default-500 mt-1 max-w-xl">
                  This chart shows how global {type} temperatures have deviated
                  from long-term historical averages. Data is{" "}
                  <span className="font-medium">
                    {type === "land" ? "monthly" : "yearly"}
                  </span>{" "}
                  and anomalies are in °C.
                </p>
              </div>

              <div className="flex gap-2">
                {/* Type select */}
                <Select
                  className="w-[130px]"
                  label="Data type"
                  selectedKeys={[type]}
                  size="sm"
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];

                    if (selected === "land" || selected === "ocean") {
                      setType(selected);
                    }
                  }}
                >
                  <SelectItem key="land" textValue="Land">
                    Land
                  </SelectItem>
                  <SelectItem key="ocean" textValue="Ocean">
                    Ocean
                  </SelectItem>
                </Select>

                {/* Year select */}
                <Select
                  className="w-[130px]"
                  label="Starting year"
                  selectedKeys={[startYear.toString()]}
                  size="sm"
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];

                    if (selected) setStartYear(parseInt(selected.toString()));
                  }}
                >
                  {[...Array(2024 - 1950 + 1)].map((_, i) => {
                    const year = 1950 + i;

                    return (
                      <SelectItem
                        key={year.toString()}
                        textValue={year.toString()}
                      >
                        {year}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            </div>

            {/* Latest reading + Export */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-default-500">
                <p>
                  📅 Latest reading:{" "}
                  <span className="font-semibold text-default-800">
                    {latestLabel}
                  </span>
                </p>
                <p>
                  {type === "land" ? "🟢 Land" : "🔵 Ocean"}:{" "}
                  <span
                    className={`font-medium ${type === "land" ? "text-green-600" : "text-blue-600"}`}
                  >
                    {latestValue?.toFixed(3)}°C
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  startContent={<DownloadIcon size={16} />}
                  variant="bordered"
                  onPress={() => handleExport("png")}
                >
                  Export PNG
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleExport("pdf")}
                >
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Chart */}
            <div ref={chartRef} className="h-[400px]">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[yMin, yMax]}
                    tick={{ fontSize: 12 }}
                    unit="°C"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{
                      color: "#374151",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  />
                  <Line
                    isAnimationActive
                    dataKey={type === "land" ? "land" : "anomaly"}
                    dot={false}
                    stroke={type === "land" ? "#10b981" : "#3b82f6"}
                    strokeWidth={2}
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
