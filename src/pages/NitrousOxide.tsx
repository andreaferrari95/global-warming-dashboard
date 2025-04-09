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
import { getNitrousData } from "@/api/nitrous";

interface ChartEntry {
  label: string;
  year: number;
  average: number;
  trend: number;
}

export default function NitrousPage() {
  const [data, setData] = useState<ChartEntry[]>([]);
  const [startYear, setStartYear] = useState<number>(2002);
  const [selectedKey, setSelectedKey] = useState<string>("2002");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const formatLabel = (decimalYear: string) => {
    const [yearStr, decimalStr] = decimalYear.split(".");
    const year = parseInt(yearStr);
    const decimal = parseFloat("0." + (decimalStr ?? "0"));
    const month = Math.round(decimal * 12);
    const date = new Date(year, month);

    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const raw = await getNitrousData();

      const formatted = raw
        .map((entry) => {
          const year = Math.floor(parseFloat(entry.date));

          return {
            label: formatLabel(entry.date),
            year,
            average: parseFloat(entry.average),
            trend: parseFloat(entry.trend),
          };
        })
        .filter((entry) => entry.year >= startYear);

      setData(formatted);
      setLoading(false);
    };

    fetch();
  }, [startYear]);

  const handleExport = async (type: "png" | "pdf") => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    if (type === "png") {
      const link = document.createElement("a");

      link.download = `n2o-chart-${startYear}.png`;
      link.href = imgData;
      link.click();
    } else {
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`n2o-chart-${startYear}.pdf`);
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">
          🌬️ Atmospheric Nitrous Oxide (N₂O)
        </h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner label="Loading N₂O data..." size="lg" />
          </div>
        ) : (
          <Card className="p-6">
            {/* Header & Dropdown */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Monthly N₂O Concentrations (ppb)
                </h2>
                <p className="text-sm text-default-500 mt-1 max-w-xl">
                  This chart shows atmospheric nitrous oxide (N₂O) levels in
                  parts per billion (ppb).
                  <strong className="text-red-500"> Trend</strong> highlights
                  long-term movement, while{" "}
                  <span className="text-gray-500 font-semibold">Average</span>{" "}
                  reflects short-term values.
                </p>
              </div>

              <Select
                className="w-[150px] text-gray-800"
                label="Starting year"
                selectedKeys={[selectedKey]} // ✅ makes the selection persist visually
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
                {Array.from(
                  { length: new Date().getFullYear() - 2002 + 1 },
                  (_, i) => {
                    const year = 2002 + i;

                    return (
                      <SelectItem
                        key={year.toString()}
                        textValue={year.toString()}
                      >
                        {year}
                      </SelectItem>
                    );
                  },
                )}
              </Select>
            </div>

            {/* Latest data & Export */}
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
                      {data.at(-1)?.trend.toFixed(2)} ppb
                    </span>{" "}
                    | ⚪ Average:{" "}
                    <span className="text-gray-500 font-medium">
                      {data.at(-1)?.average.toFixed(2)} ppb
                    </span>
                  </p>
                </div>
              )}

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
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[310, 345]}
                    tick={{ fontSize: 12 }}
                    unit=" ppb"
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
                    dataKey="average"
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
