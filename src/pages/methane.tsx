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
        <div className="max-w-5xl mx-auto w-full px-4 py-12">
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
        />
      )}
    </HomeLayout>
  );
}
