import { portfolio, type Locale } from "@/content/portfolio";

const technologies = ["Next.js", "React", "TypeScript", "JavaScript", "Vue.js", "Node.js", "Go", "Supabase", "MySQL", "MongoDB", "Tailwind CSS", "n8n"];

const Skills = ({ locale }: { locale: Locale }) => {
  const copy = portfolio[locale];
  return (
    <aside className="portfolio-skills portfolio-wrap" id="skills" aria-label={copy.skillsHeading}>
      <h2>{copy.skillsHeading}</h2>
      <p>{copy.skillsIntro}</p>
      <ul>{technologies.map((technology) => <li>{technology}</li>)}</ul>
    </aside>
  );
};

export default Skills;
