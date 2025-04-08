import { title } from "@/components/primitives";
import HomeLayout from "@/layouts/home";

export default function PolarIcePage() {
  return (
    <HomeLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Polar Ice</h1>
        </div>
      </section>
    </HomeLayout>
  );
}
