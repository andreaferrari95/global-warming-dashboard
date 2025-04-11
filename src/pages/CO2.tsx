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
        <div className="max-w-5xl mx-auto w-full px-4 ">
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
        >
          <div className="mt-6 text-sm text-default-600 leading-relaxed space-y-4">
            <h2 className="text-lg font-semibold text-default-800">
              📘 How to read the chart
            </h2>
            <p>
              This chart visualizes the amount of <strong>CO₂</strong> (carbon
              dioxide) in the atmosphere measured at Mauna Loa Observatory. It’s
              one of the most reliable datasets for tracking global emissions.
            </p>
            <p>
              <strong>🔴 Trend</strong> (red line) represents the long-term
              smoothed CO₂ concentration, filtering out short-term variations.
              It reveals the steady rise due to fossil fuel emissions.
            </p>
            <p>
              <strong>⚪ Cycle</strong> (gray dashed line) shows the seasonal
              fluctuations caused by the natural carbon cycle (like plants
              absorbing CO₂ during growing seasons).
            </p>
            <p>
              You can change the starting year above to focus on recent or
              historic periods. Hover over the chart to inspect specific data
              points, or export the chart to share it.
            </p>
            <p className="italic text-default-500">
              Note: Pre-industrial CO₂ levels were ~280 ppm. We&apos;re now over
              420 ppm – a significant driver of climate change.
            </p>
          </div>
        </ReusableChartPage>
      )}
    </HomeLayout>
  );
}
