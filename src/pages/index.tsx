import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { useCachedData } from "@/utils/useCachedData";
import HomeLayout from "@/layouts/home";
import Header from "@/components/Header";
import WeatherWidget from "@/components/WeatherWidget";
import { getTemperatureData } from "@/api/temperature";
import { getCo2Data } from "@/api/co2";
import { getMethaneData } from "@/api/methane";
import { getNitrousData } from "@/api/nitrous";
import { getPolarIceData } from "@/api/polar";

interface DashboardCard {
  title: string;
  emoji: string;
  path: string;
  description: string;
  useLiveData?: () => string | null;
}

const cardConfig: DashboardCard[] = [
  {
    title: "Temperature",
    emoji: "🌡️",
    path: "/temperature",
    description: "Track global land and ocean temperature anomalies over time.",
    useLiveData: () =>
      useCachedData("live-temperature", async () => {
        const data = await getTemperatureData();
        const latest = data.at(-1);
        const land = parseFloat(latest?.land ?? "0");

        return `🌍 Land: ${land.toFixed(2)}°C`;
      }),
  },
  {
    title: "CO2",
    emoji: "🏭",
    path: "/co2",
    description: "View atmospheric CO₂ concentrations and seasonal trends.",
    useLiveData: () =>
      useCachedData("live-co2", async () => {
        const data = await getCo2Data();
        const latest = data.at(-1);
        const trend = parseFloat(latest?.trend ?? "0");

        return `🔴 Trend: ${trend.toFixed(2)} ppm`;
      }),
  },
  {
    title: "Methane",
    emoji: "💨",
    path: "/methane",
    description: "Examine CH₄ levels and their long-term impact on climate.",
    useLiveData: () =>
      useCachedData("live-methane", async () => {
        const data = await getMethaneData();
        const latest = data.at(-1);
        const trend = parseFloat(latest?.trend ?? "0");

        return `🔴 Trend: ${trend.toFixed(2)} ppb`;
      }),
  },
  {
    title: "Nitrous Oxide",
    emoji: "🧪",
    path: "/nitrous-oxide",
    description: "See N₂O concentrations and the evolving atmospheric trend.",
    useLiveData: () =>
      useCachedData("live-nitrous", async () => {
        const data = await getNitrousData();
        const latest = data.at(-1);
        const trend = parseFloat(latest?.trend ?? "0");

        return `🔴 Trend: ${trend.toFixed(2)} ppb`;
      }),
  },
  {
    title: "Polar Ice",
    emoji: "🧊",
    path: "/polar-ice",
    description: "Monitor sea ice extent across polar regions.",
    useLiveData: () =>
      useCachedData("live-polar", async () => {
        const raw = await getPolarIceData();
        const lastKey = Object.keys(raw.data).at(-1);
        const latest = raw.data[lastKey ?? ""] ?? { value: 0 };

        return `🧊 Value: ${latest.value.toFixed(2)} M km²`;
      }),
  },
  {
    title: "About",
    emoji: "📘",
    path: "/about",
    description: "Discover the mission and science behind GreenPulse.",
  },
];

export default function IndexPage() {
  return (
    <HomeLayout>
      <section className="flex flex-col items-center justify-center gap-6  px-4">
        <Header />
        <WeatherWidget />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {cardConfig.map((card) => {
            const live = card.useLiveData?.();

            return (
              <Link key={card.title} className="h-full" href={card.path}>
                <Card
                  isHoverable
                  className="h-full transition-shadow hover:shadow-lg cursor-pointer"
                >
                  <CardHeader className="text-xl font-semibold">
                    <span aria-label={card.title} role="img">
                      {card.emoji}
                    </span>{" "}
                    {card.title}
                  </CardHeader>
                  <CardBody className="space-y-2">
                    <p className="text-sm text-default-500">
                      {card.description}
                    </p>
                    {card.useLiveData && (
                      <p className="text-xs text-default-700 font-medium">
                        {live ?? "Loading..."}
                      </p>
                    )}
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </HomeLayout>
  );
}
