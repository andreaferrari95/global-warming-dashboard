import { title, subtitle } from "@/components/primitives";
import HomeLayout from "@/layouts/home";

export default function AboutPage() {
  return (
    <HomeLayout>
      <section className="flex flex-col items-center justify-center gap-8 px-4 ">
        {/* Hero Section */}
        <div className="text-center max-w-3xl space-y-4">
          <h1 className={title()}>
            Welcome to <span className="text-green-500">GreenPulse</span>
          </h1>
          <p className={subtitle()}>
            A climate data dashboard designed to raise awareness and promote
            action through science and design.
          </p>
        </div>

        {/* Purpose */}
        <div className="max-w-3xl space-y-4 text-default-500 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-default-900">
            🌍 Why GreenPulse?
          </h2>
          <p>
            GreenPulse was born from a passion for climate science and a desire
            to present environmental data in a clear and engaging way. It offers
            live insights into Earth&#39;s changing climate—tracking global
            temperatures, greenhouse gas levels, polar ice, and more.
          </p>
        </div>

        {/* Data Sources */}
        <div className="max-w-3xl space-y-4 text-default-500 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-default-900">
            📊 Data Sources
          </h2>
          <p>
            The platform uses publicly available and regularly updated APIs,
            including:
          </p>
          <ul className="list-disc list-inside">
            <li>
              <strong>Global Warming API</strong>: provides historical climate
              data on CO₂, methane, nitrous oxide, temperature anomalies, and
              polar ice extent.
            </li>
            <li>
              <strong>Weatherbit API</strong>: delivers real-time weather and
              7-day forecasts based on the user&#39;s location.
            </li>
          </ul>
        </div>

        {/* Personal Motivation */}
        <div className="max-w-3xl space-y-4 text-default-500 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-default-900">
            💡 Personal Motivation
          </h2>
          <p>
            I&#39;m a student and developer working on this project as part of
            my learning journey with <strong>Start2Impact</strong>. GreenPulse
            is both a portfolio piece and a meaningful exploration of how data
            can inspire climate action.
          </p>
        </div>

        {/* Contact Section */}
        <div className="max-w-3xl space-y-4 text-default-500 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold text-default-900">🤝 Connect</h2>
          <p>
            This is an open and evolving project. If you have feedback, want to
            collaborate, or just want to say hi, feel free to reach out:
          </p>
          <ul className="list-none space-y-1">
            <li>
              📧{" "}
              <a
                className="text-green-500 hover:underline"
                href="mailto:andreaferraridev@gmail.com"
              >
                andreaferraridev@gmail.com
              </a>
            </li>
            <li>
              💼{" "}
              <a
                className="text-green-500 hover:underline"
                href="https://www.linkedin.com/in/andrea-ferrari-developer/"
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
            <li>
              💻{" "}
              <a
                className="text-green-500 hover:underline"
                href="https://github.com/andreaferrari95/"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </section>
    </HomeLayout>
  );
}
