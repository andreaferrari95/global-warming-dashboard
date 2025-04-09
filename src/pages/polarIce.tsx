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
import { getPolarIceData } from "@/api/polar";

interface IceEntry {
  label: string;
  year: number;
  value: number;
  monthlyMean: number;
}

export default function PolarIcePage() {
  const [data, setData] = useState<IceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [startYear, setStartYear] = useState<number>(1990); // ⬅️ default updated to 1990
  const chartRef = useRef<HTMLDivElement>(null);

  const formatDateLabel = (key: string): string => {
    const year = key.slice(0, 4);
    const month = key.slice(4);
    const date = new Date(parseInt(year), parseInt(month) - 1);

    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const raw = await getPolarIceData();

      const entries = Object.entries(raw.data).map(([key, val]) => {
        const year = parseInt(key.slice(0, 4));

        return {
          label: formatDateLabel(key),
          year,
          value: val.value,
          monthlyMean: val.monthlyMean,
        };
      });

      const filtered = entries.filter((e) => e.year >= startYear);

      setData(filtered);
      setLoading(false);
    };

    fetch();
  }, [startYear]);

  const handleExportPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");

      link.download = `polar-ice-${startYear}.png`;
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
      pdf.save(`polar-ice-${startYear}.pdf`);
    }
  };

  return (
    <HomeLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">🧊 Global Polar Ice Extent</h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <Spinner label="Loading ice extent data..." size="lg" />
          </div>
        ) : (
          <Card className="p-6">
            {/* Description + Dropdown */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Monthly Sea Ice Extent (million km²)
                </h2>
                <p className="text-sm text-default-500 mt-1 max-w-xl">
                  This chart shows the total sea ice extent across both poles.
                  <strong className="text-blue-500"> Actual Value</strong> is
                  the measured extent, while{" "}
                  <span className="text-gray-500 font-semibold">
                    Monthly Mean
                  </span>{" "}
                  represents the baseline for the 1991–2020 period.
                </p>
              </div>

              <Select
                className="w-[150px] text-gray-800"
                label="Starting year"
                selectedKeys={[startYear.toString()]}
                size="sm"
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];

                  if (selected) setStartYear(parseInt(selected.toString()));
                }}
              >
                {[...Array(new Date().getFullYear() - 1990 + 1)].map((_, i) => {
                  const year = 1990 + i;

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

            {/* Latest Reading + Export */}
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
                    🔵 Value:{" "}
                    <span className="text-blue-600 font-medium">
                      {data.at(-1)?.value.toFixed(2)} million km²
                    </span>{" "}
                    | ⚪ Monthly Mean:{" "}
                    <span className="text-gray-500 font-medium">
                      {data.at(-1)?.monthlyMean.toFixed(2)} million km²
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
                    domain={[15, 30]}
                    tick={{ fontSize: 12 }}
                    unit=" M km²"
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
                    dataKey="value"
                    dot={false}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    type="monotone"
                  />
                  <Line
                    isAnimationActive
                    dataKey="monthlyMean"
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
