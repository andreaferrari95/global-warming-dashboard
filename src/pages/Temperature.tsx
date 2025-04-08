import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
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

import HomeLayout from "@/layouts/home";
import { getTemperatureData } from "@/api/temperature";

interface TemperatureEntry {
  time: string;
  station: string;
  land: number;
  ocean: string;
}

export default function TemperaturesPage() {
  const [data, setData] = useState<TemperatureEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDateLabel = (decimalYear: string) => {
    const yearNum = parseInt(decimalYear);
    const decimal = parseFloat(decimalYear) - yearNum;
    const approxMonth = Math.round(decimal * 12); // 0–11
    const date = new Date(yearNum, approxMonth);

    return date.toLocaleString("default", { month: "short", year: "numeric" }); // "Feb 2025"
  };

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const result = await getTemperatureData();

        const formatted = result.map((entry) => ({
          ...entry,
          label: formatDateLabel(entry.time), // Add label for X-axis
          land: parseFloat(entry.land), // convert land string to number
        }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch temperature data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemperature();
  }, []);

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
            <h2 className="text-lg font-semibold mb-4">
              Land Temperature Anomalies (°C)
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer height="100%" width="100%">
                <LineChart
                  data={data.slice(-100)}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} unit="°C" />
                  <Tooltip />
                  <Line
                    dataKey="land"
                    dot={false}
                    stroke="#10b981"
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
