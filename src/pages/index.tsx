import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { title, subtitle } from "@/components/primitives";
import HomeLayout from "@/layouts/home";

const cards = [
  { title: "Temperature", emoji: "🌡️", path: "/temperature" },
  { title: "CO2", emoji: "🏭", path: "/co2" },
  { title: "Methane", emoji: "💨", path: "/methane" },
  { title: "Nitrous Oxide", emoji: "🧪", path: "/nitrous-oxide" },
  { title: "Polar Ice", emoji: "🧊", path: "/polar-ice" },
];

export default function IndexPage() {
  return (
    <HomeLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-10 px-4">
        {/* Header */}
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1 className={title()}>
            Welcome to <span className="text-green-600">GreenPulse</span>
          </h1>
          <p className={subtitle({ class: "mt-4" })}>
            Explore global warming through real-world data. Choose a metric
            below to begin.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {cards.map((card) => (
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
                <CardBody>
                  <p className="text-sm text-default-500">
                    View historical data and climate trends for{" "}
                    {card.title.toLowerCase()}.
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </HomeLayout>
  );
}
