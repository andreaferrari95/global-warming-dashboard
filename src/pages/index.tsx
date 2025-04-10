import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { motion } from "framer-motion";

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
    title: "Temperatures",
    emoji: "🌡️",
    path: "/temperatures",
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
    title: "CO₂",
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
    <>
      {/* Mobile Fixed WeatherWidget */}
      <div className="sm:hidden fixed top-2 left-0 right-0 z-50 px-4">
        <WeatherWidget />
      </div>

      <HomeLayout>
        <section className="flex flex-col items-center justify-center gap-8 px-4 pt-16 sm:pt-0">
          {/* Header + Weather Widget (Desktop) */}
          <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
            <div className="flex-1 mb-8 sm:mb-0">
              <Header />
            </div>
            <div className="hidden sm:block">
              <WeatherWidget />
            </div>
          </div>

          {/* Animated Dashboard Cards */}
          <motion.div
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl py-10"
            initial="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {cardConfig.map((card) => {
              const live = card.useLiveData?.();

              return (
                <motion.div
                  key={card.title}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link className="h-full flex" href={card.path}>
                    <Card
                      isHoverable
                      className="h-full flex-1 min-w-0 rounded-xl shadow-md transition-all duration-200 border-2 border-default-200 hover:shadow-xl hover:scale-[1.02] hover:bg-white/5 cursor-pointer"
                    >
                      <CardHeader className="text-xl font-semibold">
                        <span aria-label={card.title} role="img">
                          {card.emoji}
                        </span>{" "}
                        {card.title}
                      </CardHeader>
                      <CardBody className="space-y-2 h-[100px] flex flex-col justify-between">
                        <p className="text-sm text-default-500">
                          {card.description}
                        </p>
                        {card.useLiveData ? (
                          live ? (
                            <p className="text-xs text-default-700 font-medium min-h-[20px]">
                              {live}
                            </p>
                          ) : (
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                          )
                        ) : null}
                      </CardBody>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </HomeLayout>
    </>
  );
}
