import ExperienceItem from "./ExperienceItem.tsx";
import { portfolio, type Locale } from "@/content/portfolio";

const Jobs = ({ locale }: { locale: Locale }) => {
  const copy = portfolio[locale];
  return (
    <div className="portfolio-job-list">
      <ExperienceItem
        title={copy.freelancer}
        date={locale === "es" ? "Trabajo actual" : "Current work"}
        skills={locale === "es"
          ? "Trabajo de forma independiente con clientes propios para crear soluciones web adaptadas a sus necesidades. Desarrollo aplicaciones web, integro servicios mediante APIs y automatizo procesos para simplificar tareas y mejorar sus flujos de trabajo."
          : "I work independently with my own clients to build web solutions tailored to their needs. I develop web applications, connect services through APIs, and automate processes to simplify tasks and improve workflows."}
      />
      <ExperienceItem
        title={locale === "es" ? "Desarrollador frontend (remoto) · Atrinium, España" : "Frontend Developer (Remote) · Atrinium, Spain"}
        date="2024 - 2026-09-21"
        skills={locale === "es"
          ? "Desarrollé y mantuve soluciones web con Next.js para proyectos del sector de seguros, incluido el software Hermes. Implementé funcionalidades, cuidé la calidad y consistencia del código siguiendo principios de clean code y entregué interfaces optimizadas y fáciles de usar. También contribuí al desarrollo de la landing page de Flesip, centrada en una experiencia moderna y adaptable."
          : "Developed and maintained web solutions using Next.js for projects in the insurance industry, including Hermes software. Implemented features, maintained code quality and consistency following clean-code principles, and delivered optimized, user-friendly interfaces. Also contributed to the Flesip landing page, focused on a modern and responsive experience."}
      />
      <ExperienceItem
        title="Nival Digital · Landing page"
        date="2023 - 2023"
        skills={locale === "es"
          ? "Desarrollé la landing page de Nival Digital con React, Next.js, Tailwind CSS y TypeScript."
          : "Built the Nival Digital landing page with React, Next.js, Tailwind CSS, and TypeScript."}
      />
      <p className="portfolio-personal-projects">{copy.personal}</p>
    </div>
  );
};
export default Jobs;
