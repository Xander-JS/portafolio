import { ScrollytellingTemplate } from "@/components/templates/ScrollytellingTemplate";
import { currentYear } from "@/components/templates/PortfolioTemplate";

// The 3D scrollytelling home. Steps 00–06 (hero + the six modules) live in data/steps.ts; each still has its own
// detail page at /<slug> via PortfolioTemplate. Year is resolved on the server (cached daily) to keep the client
// template free of prerender-time clock reads.
export default async function Home() {
  return <ScrollytellingTemplate year={await currentYear()} />;
}
