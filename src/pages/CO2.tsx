import { useEffect, useState, useRef } from "react";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { Card } from "@heroui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@heroui/button";
import { DownloadIcon } from "lucide-react";

import HomeLayout from "@/layouts/home";
import { getCo2Data, Co2Entry } from "@/api/co2";

interface ChartEntry {
  label: string;
  trend: number;
  cycle: number;
  year: number;
}

export default function Co2Page() {
  const [data, setData] = useState<ChartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startYear, setStartYear] = useState(2015);
  const [selectedKey, setSelectedKey] = useState<string>("2015"); // ✅ controlled Select
  const chartRef = useRef<HTMLDivElement>(null);

  const formatLabel = (entry: Co2Entry) => {
    const year = parseInt(entry.year);
    const month = parseInt(entry.month) - 1;
    const day = parseInt(entry.day);
    const date = new Date(year, month, day);

    return date.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const raw = await getCo2Data();

      const formatted = raw
        .map((entry) => {
          const year = parseInt(entry.year);
          const label = formatLabel(entry);

          return {
            label,
            year,
            trend: parseFloat(entry.trend),
            cycle: parseFloat(entry.cycle),
          };
        })
        .filter((entry) => entry.year >= startYear);

      setData(formatted);
      setLoading(false);
    };

    fetch();
  }, [startYear]);

  const handleExportPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");

      link.download = `co2-chart-${startYear}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleExportPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`co2-chart-${startYear}.pdf`);
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">💨 Atmospheric CO₂ Levels</h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner label="Loading CO₂ data..." size="lg" />
          </div>
        ) : (
          <Card className="p-6">
            {/* Description & dropdown aligned */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Daily CO₂ Concentrations (ppm)
                </h2>
                <p className="text-sm text-default-500 mt-1 max-w-xl">
                  This chart displays daily carbon dioxide (CO₂) measurements in
                  parts per million (ppm).
                  <strong className="text-red-500"> Trend</strong> represents
                  the long-term smoothed values, while{" "}
                  <span className="text-gray-500 font-semibold">Cycle</span>{" "}
                  captures seasonal variation.
                </p>
              </div>

              {/* HeroUI Year Dropdown */}
              <Select
                className="w-[150px] text-gray-800"
                label="Starting year"
                selectedKeys={[selectedKey]}
                size="sm"
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];

                  if (selected) {
                    setSelectedKey(selected.toString());
                    setStartYear(parseInt(selected.toString()));
                  }
                }}
              >
                {[...Array(10)].map((_, i) => {
                  const year = 2015 + i;

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

            {/* Latest readings + export buttons aligned */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {data.length > 0 && (
                <div className="text-sm text-default-500">
                  <p>
                    📅 Latest reading:{" "}
                    <span className="font-semibold text-default-800">
                      {data.at(-1)?.label}
                    </span>
                  </p>
                  <p>
                    🔴 Trend:{" "}
                    <span className="text-red-600 font-medium">
                      {data.at(-1)?.trend.toFixed(2)} ppm
                    </span>{" "}
                    | ⚪ Cycle:{" "}
                    <span className="text-gray-500 font-medium">
                      {data.at(-1)?.cycle.toFixed(2)} ppm
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  startContent={<DownloadIcon size={16} />}
                  variant="bordered"
                  onPress={handleExportPNG}
                >
                  Export PNG
                </Button>
                <Button size="sm" variant="bordered" onPress={handleExportPDF}>
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Chart */}
            <div ref={chartRef} className="h-[400px]">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[395, 440]}
                    tick={{ fontSize: 12 }}
                    unit=" ppm"
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
                    dataKey="trend"
                    dot={false}
                    stroke="#ef4444"
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    isAnimationActive
                    dataKey="cycle"
                    dot={false}
                    stroke="#9ca3af"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
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
