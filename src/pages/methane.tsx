import { useMemo } from "react";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getMethaneData } from "@/api/methane";

export default function MethanePage() {
  const formatData = (raw: Awaited<ReturnType<typeof getMethaneData>>) => {
    return raw.map((entry) => {
      const [yearStr, decimalStr = "0"] = entry.date.split(".");
      const year = parseInt(yearStr);
      const decimal = parseFloat("0." + decimalStr);
      const month = Math.round(decimal * 12);
      const date = new Date(year, month);

      return {
        label: date.toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        }),
        year,
        average: parseFloat(entry.average),
        trend: parseFloat(entry.trend),
      };
    });
  };

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <HomeLayout>
      <ReusableChartPage
        defaultStartYear={1985}
        description="This chart displays monthly atmospheric Methane (CH₄) concentrations in parts per billion (ppb). Trend shows long-term change, while Average includes seasonal cycles."
        fetchData={getMethaneData}
        formatData={formatData}
        getLatestText={(entry) => (
          <>
            🔴 Trend:{" "}
            <span className="text-red-600 font-medium">
              {entry.trend.toFixed(2)} ppb
            </span>{" "}
            | ⚪ Average:{" "}
            <span className="text-gray-500 font-medium">
              {entry.average.toFixed(2)} ppb
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
            key: "average",
            color: "#9ca3af",
            strokeDasharray: "4 4",
            name: "Average",
          },
        ]}
        title="🧪 Atmospheric Methane (CH₄)"
        yDomain={[1600, 2000]}
        yUnit=" ppb"
        yearRange={[1985, currentYear]}
      />
    </HomeLayout>
  );
}
