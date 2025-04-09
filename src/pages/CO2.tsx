import { useState } from "react";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getCo2Data, Co2Entry } from "@/api/co2";

export default function Co2Page() {
  const formatCo2 = (raw: Co2Entry[]) => {
    return raw.map((entry) => {
      const year = parseInt(entry.year);
      const month = parseInt(entry.month) - 1;
      const day = parseInt(entry.day);
      const date = new Date(year, month, day);

      return {
        label: date.toLocaleDateString("default", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        year,
        trend: parseFloat(entry.trend),
        cycle: parseFloat(entry.cycle),
      };
    });
  };

  return (
    <HomeLayout>
      <ReusableChartPage
        defaultStartYear={2015}
        description="This chart displays daily carbon dioxide (CO₂) measurements in parts per million (ppm). The red line shows long-term smoothed trends, and the dashed line captures seasonal cycles."
        fetchData={getCo2Data}
        formatData={formatCo2}
        getLatestText={(entry) => (
          <>
            🔴 Trend:{" "}
            <span className="text-red-600 font-medium">
              {entry.trend?.toFixed(2)} ppm
            </span>{" "}
            | ⚪ Cycle:{" "}
            <span className="text-gray-500 font-medium">
              {entry.cycle?.toFixed(2)} ppm
            </span>
          </>
        )}
        lineSeries={[
          {
            key: "trend",
            color: "#ef4444",
            name: "Trend",
          },
          {
            key: "cycle",
            color: "#9ca3af",
            strokeDasharray: "4 4",
            name: "Cycle",
          },
        ]}
        title="💨 Atmospheric CO₂ Levels"
        yUnit=" ppm"
        yearRange={[2015, new Date().getFullYear()]}
      />
    </HomeLayout>
  );
}
