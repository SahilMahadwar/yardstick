import { ArrowRight, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";

export function Navbar() {
  const pathname = usePathname();
  const isInsightsPage = pathname === "/insights";

  return (
    <nav className="border-b backdrop-blur-sm bg-background/50 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <PieChart className="text-rose-500" />
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight hover:text-primary transition-colors"
            >
              Yardstick Finance Tracker
            </Link>
          </div>
          <Button>
            <Link href={isInsightsPage ? "/" : "/insights"}>
              {isInsightsPage ? "Dashboard" : "Insights"}
            </Link>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </nav>
  );
}
