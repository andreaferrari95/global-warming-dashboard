// src/components/Header.tsx
import { title, subtitle } from "@/components/primitives";

export default function Header() {
  return (
    <div className="inline-block max-w-2xl text-start justify-start">
      <h1 className={title()}>
        Welcome to <span className="text-green-600">GreenPulse</span>
      </h1>
      <p className={subtitle({ class: "mt-4" })}>
        Dive into the planet&apos;s vital signs — explore climate trends through
        real-time data and discover the story the Earth is telling. 🌍📊 <br />
        Choose a topic to explore the trends.
      </p>
    </div>
  );
}
