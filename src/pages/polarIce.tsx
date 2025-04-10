import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "@heroui/skeleton";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getPolarIceData } from "@/api/polar";

export default function PolarIcePage() {
  const [rawData, setRawData] = useState<Awaited<
    ReturnType<typeof getPolarIceData>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const formatData = (raw: Awaited<ReturnType<typeof getPolarIceData>>) => {
    return Object.entries(raw.data).map(([key, val]) => {
      const year = parseInt(key.slice(0, 4));
      const month = parseInt(key.slice(4));
      const date = new Date(year, month - 1);

      return {
        label: date.toLocaleDateString("default", {
          month: "short",
          year: "numeric",
        }),
        year,
        value: val.value,
        monthlyMean: val.monthlyMean,
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    getPolarIceData()
      .then(setRawData)
      .catch((err) => console.error("Polar Ice fetch error:", err))
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
          defaultStartYear={1990}
          description="This chart shows the total sea ice extent across both poles. The blue line shows the actual measured ice extent, while the gray dashed line represents the 1991–2020 monthly baseline."
          fetchData={() => Promise.resolve(rawData)}
          formatData={formatData}
          getLatestText={(entry) => (
            <>
              🔵 Value:{" "}
              <span className="text-blue-600 font-medium">
                {entry.value.toFixed(2)} million km²
              </span>{" "}
              | ⚪ Monthly Mean:{" "}
              <span className="text-gray-500 font-medium">
                {entry.monthlyMean.toFixed(2)} million km²
              </span>
            </>
          )}
          lineSeries={[
            {
              key: "value",
              color: "#3b82f6",
              name: "Observed Ice Extent",
            },
            {
              key: "monthlyMean",
              color: "#9ca3af",
              strokeDasharray: "4 4",
              name: "Monthly Mean (1991–2020)",
            },
          ]}
          title="🧊 Global Polar Ice Extent"
          yDomain={[15, 30]}
          yUnit=" M km²"
          yearRange={[1990, currentYear]}
        />
      )}
    </HomeLayout>
  );
}
