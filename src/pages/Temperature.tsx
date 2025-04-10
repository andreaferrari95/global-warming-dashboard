import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getTemperatureData } from "@/api/temperature";
import { getOceanData } from "@/api/ocean";

type Mode = "land" | "ocean";

export default function TemperaturesPage() {
  const [mode, setMode] = useState<Mode>("land");
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetcher = mode === "land" ? getTemperatureData : getOceanData;
  const formatter =
    mode === "land"
      ? (raw: any[]) => {
          return raw.map((entry) => {
            const year = Math.floor(parseFloat(entry.time));
            const decimal = parseFloat(entry.time) - year;
            const month = Math.round(decimal * 12);
            const date = new Date(year, month);

            return {
              label: date.toLocaleDateString("default", {
                month: "short",
                year: "numeric",
              }),
              year,
              land: parseFloat(entry.land),
            };
          });
        }
      : (raw: any[]) => {
          return raw.map((entry) => ({
            label: entry.year,
            year: parseInt(entry.year),
            anomaly: parseFloat(entry.anomaly),
          }));
        };

  useEffect(() => {
    setLoading(true);
    fetcher()
      .then((data) => setRawData(data))
      .catch((err) => console.error("Data load error:", err))
      .finally(() => setLoading(false));
  }, [mode]);

  return (
    <HomeLayout>
      {loading || !rawData ? (
        <div className="max-w-5xl mx-auto w-full px-4 py-12">
          <Skeleton className="h-10 w-60 mb-4" />
          <Skeleton className="h-4 w-full max-w-xl mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <ReusableChartPage
          defaultStartYear={1950}
          description={`This chart shows how global ${
            mode === "land" ? "land" : "ocean"
          } temperatures have deviated from historical averages. Data is ${
            mode === "land" ? "monthly" : "yearly"
          } and expressed as temperature anomalies.`}
          extraDropdowns={[
            {
              label: "Data type",
              selectedKey: mode,
              options: [
                { key: "land", label: "Land" },
                { key: "ocean", label: "Ocean" },
              ],
              onChange: (key) => {
                if (key === "land" || key === "ocean") {
                  setMode(key);
                }
              },
            },
          ]}
          fetchData={() => Promise.resolve(rawData)}
          formatData={formatter}
          getLatestText={(entry) => {
            const value = mode === "land" ? entry.land : entry.anomaly;
            const display =
              typeof value === "number" ? value.toFixed(3) : "N/A";

            return (
              <>
                {mode === "land" ? "🟢 Land" : "🔵 Ocean"}:{" "}
                <span
                  className={
                    mode === "land" ? "text-green-600" : "text-blue-600"
                  }
                >
                  {display}°C
                </span>
              </>
            );
          }}
          lineSeries={[
            {
              key: mode === "land" ? "land" : "anomaly",
              color: mode === "land" ? "#10b981" : "#3b82f6",
              name: mode === "land" ? "Land Anomaly" : "Ocean Anomaly",
            },
          ]}
          title="🌡️ Global Temperature Data"
          yUnit="°C"
          yearRange={[1950, new Date().getFullYear()]}
        />
      )}
    </HomeLayout>
  );
}
