// src/components/Header.tsx
import { title, subtitle } from "@/components/primitives";

export default function Header() {
  return (
    <div className="inline-block max-w-2xl text-start justify-start">
      <h1 className={title()}>
        Welcome to <span className="text-green-600">GreenPulse</span>
      </h1>
      <p className={subtitle({ class: "mt-4" })}>
        Explore global warming through real-world data. Choose a metric below to
        begin.
      </p>
    </div>
  );
}
