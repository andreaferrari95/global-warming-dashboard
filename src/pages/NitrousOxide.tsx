import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@heroui/skeleton";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getNitrousData } from "@/api/nitrous";

export default function NitrousPage() {
  const [rawData, setRawData] = useState<Awaited<
    ReturnType<typeof getNitrousData>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const formatNitrous = (raw: Awaited<ReturnType<typeof getNitrousData>>) => {
    return raw.map((entry) => {
      const [yearStr, decimalStr] = entry.date.split(".");
      const year = parseInt(yearStr);
      const decimal = parseFloat("0." + (decimalStr ?? "0"));
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
    getNitrousData()
      .then(setRawData)
      .catch((err) => console.error("N₂O fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <HomeLayout>
      {loading || !rawData ? (
        <div className="max-w-5xl mx-auto w-full px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-xl mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <ReusableChartPage
          defaultStartYear={2002}
          description="This chart shows atmospheric nitrous oxide (N₂O) levels in parts per billion (ppb). The red line represents long-term trend, while the gray line shows short-term average values."
          fetchData={() => Promise.resolve(rawData)}
          formatData={formatNitrous}
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
          title="🌬️ Atmospheric Nitrous Oxide (N₂O)"
          yDomain={[310, 345]}
          yUnit=" ppb"
          yearRange={[2002, currentYear]}
        >
          <div className="mt-6 text-sm text-default-600 leading-relaxed space-y-4">
            <h2 className="text-lg font-semibold text-default-800">
              📘 How to read the chart
            </h2>
            <p>
              Nitrous oxide (<strong>N₂O</strong>) is a powerful greenhouse gas,
              contributing to both global warming and the depletion of the ozone
              layer. Its emissions primarily come from agricultural activities,
              including fertilizer use.
            </p>
            <p>
              <strong>🔴 Trend</strong> shows the smoothed, long-term
              progression of N₂O levels, helping to reveal the persistent rise
              due to human activity.
            </p>
            <p>
              <strong>⚪ Average</strong> captures more short-term variations,
              which may reflect natural fluctuations and measurement cycles.
            </p>
            <p>
              You can change the starting year to explore how nitrous oxide
              levels have evolved. Export buttons above the chart let you
              download your custom view.
            </p>
            <p className="italic text-default-500">
              Although N₂O is present in smaller quantities than CO₂ or CH₄, its
              impact is long-lasting. Monitoring its levels is essential for
              climate mitigation strategies.
            </p>
          </div>
        </ReusableChartPage>
      )}
    </HomeLayout>
  );
}
