import { useState } from "react";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getTemperatureData } from "@/api/temperature";
import { getOceanData } from "@/api/ocean";

type Mode = "land" | "ocean";

export default function TemperaturesPage() {
  const [mode, setMode] = useState<Mode>("land");

  const formatLand = (raw: Awaited<ReturnType<typeof getTemperatureData>>) => {
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
  };

  const formatOcean = (raw: Awaited<ReturnType<typeof getOceanData>>) => {
    return raw.map((entry) => ({
      label: entry.year,
      year: parseInt(entry.year),
      anomaly: parseFloat(entry.anomaly),
    }));
  };

  const fetcher = mode === "land" ? getTemperatureData : getOceanData;
  const formatter = mode === "land" ? formatLand : formatOcean;

  return (
    <HomeLayout>
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
        fetchData={fetcher}
        formatData={formatter}
        getLatestText={(entry) => {
          const value = mode === "land" ? entry.land : entry.anomaly;
          const display = typeof value === "number" ? value.toFixed(3) : "N/A";

          return (
            <>
              {mode === "land" ? "🟢 Land" : "🔵 Ocean"}:{" "}
              <span
                className={mode === "land" ? "text-green-600" : "text-blue-600"}
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
    </HomeLayout>
  );
}
