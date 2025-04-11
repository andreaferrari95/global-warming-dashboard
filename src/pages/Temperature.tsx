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
        <div className="max-w-5xl mx-auto w-full px-4 ">
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
        >
          {/* Detailed interpretation section */}
          <div className="mt-6 space-y-3 text-sm text-default-600">
            <h2 className="text-lg font-semibold text-default-800">
              📘 How to read the chart
            </h2>
            <p>
              This chart displays <strong>temperature anomalies</strong>, which
              measure how much warmer or cooler a time period was compared to a
              historical baseline. A value of <code>+0.50°C</code> indicates a
              temperature that was half a degree Celsius above the long-term
              average.
            </p>
            <p>
              Use the <strong>Data type</strong> dropdown to toggle between{" "}
              <strong className="text-green-600">land</strong> and{" "}
              <strong className="text-blue-600">ocean</strong> datasets. Land
              data is recorded monthly and is more variable, while ocean data is
              aggregated yearly and reflects slower, but significant, trends.
            </p>
            <p>
              Adjust the <strong>Starting year</strong> filter to focus on more
              recent decades or long-term historical patterns. This helps reveal
              how quickly the Earth has warmed in recent years.
            </p>
            <p>
              You can also export the chart as a <code>PNG</code> image or{" "}
              <code>PDF</code> document using the buttons above.
            </p>
          </div>
        </ReusableChartPage>
      )}
    </HomeLayout>
  );
}
