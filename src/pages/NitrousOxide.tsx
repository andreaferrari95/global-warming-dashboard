import HomeLayout from "@/layouts/home";
import ReusableChartPage from "@/components/ReusableChartPage";
import { getNitrousData } from "@/api/nitrous";

export default function NitrousPage() {
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

  return (
    <HomeLayout>
      <ReusableChartPage
        defaultStartYear={2002}
        description="This chart shows atmospheric nitrous oxide (N₂O) levels in parts per billion (ppb). The red line represents long-term trend, while the gray line shows short-term average values."
        fetchData={getNitrousData}
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
        yearRange={[2002, new Date().getFullYear()]}
      />
    </HomeLayout>
  );
}
