import { Contact } from "@/components/organisms/Contact";
import { PortfolioTemplate } from "@/components/templates/PortfolioTemplate";

export default function ContactPage() {
  return (
    <PortfolioTemplate>
      <Contact level={1} />
    </PortfolioTemplate>
  );
}
