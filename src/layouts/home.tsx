import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/andreaferrari95"
          target="_blank"
          title="Andrea Ferrari GitHub"
        >
          <span className="text-default-600">Developed By</span>
          <p className="text-green-600">Andrea Ferrari</p>
        </Link>
      </footer>
    </div>
  );
}
