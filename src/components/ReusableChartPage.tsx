import { useEffect, useRef, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Select, SelectItem } from "@heroui/select";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react";

interface ChartEntry {
  label: string;
  year: number;
  [key: string]: any;
}

interface ReusableChartPageProps {
  title: string;
  description: string;
  fetchData: () => Promise<any>;
  formatData: (raw: any) => ChartEntry[];
  yUnit: string;
  yDomain?: [number, number];
  getLatestText: (latest: ChartEntry) => React.ReactNode;
  lineSeries: {
    key: string;
    color: string;
    strokeDasharray?: string;
    name: string;
  }[];
  defaultStartYear: number;
  yearRange: [number, number];
  extraDropdowns?: {
    label: string;
    selectedKey: string;
    options: { key: string; label: string }[];
    onChange: (key: string) => void;
  }[];
}

export default function ReusableChartPage({
  title,
  description,
  fetchData,
  formatData,
  yUnit,
  yDomain,
  getLatestText,
  lineSeries,
  defaultStartYear,
  yearRange,
  extraDropdowns = [], // ⬅️ new default
}: ReusableChartPageProps) {
  const [data, setData] = useState<ChartEntry[]>([]);
  const [startYear, setStartYear] = useState<number>(defaultStartYear);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const raw = await fetchData();
      const formatted = formatData(raw);

      setData(formatted.filter((d) => d.year >= startYear));
      setLoading(false);
    };

    fetch();
  }, [fetchData, formatData, startYear]);

  const handleExportPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement("a");

      link.download = `chart-${startYear}.png`;
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
      pdf.save(`chart-${startYear}.pdf`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner label="Loading data..." size="lg" />
        </div>
      ) : (
        <Card className="p-6">
          {/* Title + Description + Dropdowns */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="text-sm text-default-500 mt-1 max-w-xl">
                {description}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {extraDropdowns.map((dropdown) => (
                <Select
                  key={dropdown.label}
                  className="w-[130px] text-gray-800"
                  label={dropdown.label}
                  selectedKeys={[dropdown.selectedKey]}
                  size="sm"
                  variant="bordered"
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];

                    dropdown.onChange(String(selected));
                  }}
                >
                  {dropdown.options.map((option) => (
                    <SelectItem key={option.key} textValue={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              ))}

              {/* Start year dropdown */}
              <Select
                className="w-[130px] text-gray-800"
                label="Starting year"
                selectedKeys={[startYear.toString()]}
                size="sm"
                variant="bordered"
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];

                  if (selected) setStartYear(parseInt(String(selected)));
                }}
              >
                {[...Array(yearRange[1] - yearRange[0] + 1)].map((_, i) => {
                  const year = yearRange[0] + i;

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
            {data.length > 0 && (
              <div className="text-sm text-default-500">
                <p>
                  📅 Latest reading:{" "}
                  <span className="font-semibold text-default-800">
                    {data.at(-1)?.label}
                  </span>
                </p>
                <p>{getLatestText(data.at(-1)!)}</p>
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
                  domain={yDomain || ["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  unit={yUnit}
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
                {lineSeries.map((line) => (
                  <Line
                    key={line.key}
                    isAnimationActive
                    dataKey={line.key}
                    dot={false}
                    stroke={line.color}
                    strokeDasharray={line.strokeDasharray}
                    strokeWidth={2}
                    type="monotone"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
