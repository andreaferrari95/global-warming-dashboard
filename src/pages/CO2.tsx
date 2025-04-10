import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";

import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getCo2Data, Co2Entry } from "@/api/co2";

export default function Co2Page() {
  const [rawData, setRawData] = useState<Co2Entry[] | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setLoading(true);
    getCo2Data()
      .then(setRawData)
      .catch((err) => console.error("CO₂ fetch error:", err))
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
          defaultStartYear={2015}
          description="This chart displays daily carbon dioxide (CO₂) measurements in parts per million (ppm). The red line shows long-term smoothed trends, and the dashed line captures seasonal cycles."
          fetchData={() => Promise.resolve(rawData)}
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
      )}
    </HomeLayout>
  );
}
