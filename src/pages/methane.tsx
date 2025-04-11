import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@heroui/skeleton";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getMethaneData } from "@/api/methane";

export default function MethanePage() {
  const [rawData, setRawData] = useState<Awaited<
    ReturnType<typeof getMethaneData>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

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

  useEffect(() => {
    setLoading(true);
    getMethaneData()
      .then(setRawData)
      .catch((err) => console.error("CH₄ fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <HomeLayout>
      {loading || !rawData ? (
        <div className="max-w-5xl mx-auto w-full px-4 ">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-xl mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <ReusableChartPage
          defaultStartYear={1985}
          description="This chart displays monthly atmospheric Methane (CH₄) concentrations in parts per billion (ppb). Trend shows long-term change, while Average includes seasonal cycles."
          fetchData={() => Promise.resolve(rawData)}
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
        >
          <div className="mt-6 text-sm text-default-600 leading-relaxed space-y-4">
            <h2 className="text-lg font-semibold text-default-800">
              📘 How to read the chart
            </h2>
            <p>
              Methane (<strong>CH₄</strong>) is a potent greenhouse gas with a
              warming potential over 80 times stronger than CO₂ over a 20-year
              period. This chart tracks its concentration in the atmosphere over
              time.
            </p>
            <p>
              <strong>🔴 Trend</strong> shows the long-term progression of
              methane levels, smoothed to highlight the overall growth pattern
              without short-term noise.
            </p>
            <p>
              <strong>⚪ Average</strong> includes more granular, possibly
              seasonal variation, reflecting the natural and human sources of
              CH₄ (like agriculture and fossil fuel extraction).
            </p>
            <p>
              Use the dropdown above to adjust the start year and explore how
              methane levels have changed. You can also export the chart for use
              in presentations or reports.
            </p>
            <p className="italic text-default-500">
              Methane’s rise is concerning due to its rapid warming impact —
              though it degrades faster than CO₂, reducing emissions now could
              slow short-term warming.
            </p>
          </div>
        </ReusableChartPage>
      )}
    </HomeLayout>
  );
}
