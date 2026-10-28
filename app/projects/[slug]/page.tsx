import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/organisms/ProjectDetail";
import { PortfolioTemplate } from "@/components/templates/PortfolioTemplate";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <PortfolioTemplate>
      <ProjectDetail project={project} />
    </PortfolioTemplate>
  );
}
