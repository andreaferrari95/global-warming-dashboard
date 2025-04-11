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
        <div className="max-w-5xl mx-auto w-full px-4 ">
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
        >
          <div className="mt-6 text-sm text-default-600 leading-relaxed space-y-4">
            <h2 className="text-lg font-semibold text-default-800">
              📘 How to read the chart
            </h2>
            <p>
              Sea ice plays a crucial role in regulating Earth’s climate by
              reflecting solar radiation and maintaining global temperature
              balance. Declining polar ice is one of the clearest indicators of
              climate change.
            </p>
            <p>
              The <strong>🔵 Observed Ice Extent</strong> line shows how much
              sea ice was recorded globally across both the Arctic and Antarctic
              regions in a given month.
            </p>
            <p>
              The <strong>⚪ Monthly Mean</strong> represents the average sea
              ice extent for the same month over the period 1991–2020, serving
              as a historical baseline.
            </p>
            <p>
              Use the starting year dropdown to explore long-term trends. If the
              blue line frequently falls below the gray line, it suggests a
              long-term reduction in sea ice extent compared to historical
              norms.
            </p>
            <p className="italic text-default-500">
              Polar regions are warming nearly four times faster than the global
              average. Tracking changes in sea ice helps scientists understand
              broader impacts like rising sea levels and shifting ecosystems.
            </p>
          </div>
        </ReusableChartPage>
      )}
    </HomeLayout>
  );
}
