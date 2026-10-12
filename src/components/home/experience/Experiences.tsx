import Jobs from "./Jobs.tsx";
import Education from "./Education.tsx";
import PortfolioIcon from "@/components/ui/PortfolioIcon";
import { portfolio, type Locale } from "@/content/portfolio";

const Experiences = ({ locale }: { locale: Locale }) => {
  const copy = portfolio[locale];
  return (
    <section className="portfolio-section portfolio-wrap portfolio-experience" id="experiences">
      <div className="portfolio-experience-intro">
        <h2 className="portfolio-heading"><PortfolioIcon name="experience" className="portfolio-heading-icon" /><span>{copy.experienceHeading}</span></h2>
        <p>{copy.experienceIntro}</p>
      </div>
      <div className="portfolio-experience-columns">
        <div>
          <h3 className="portfolio-subheading">{copy.jobs}</h3>
          <Jobs locale={locale} />
        </div>
        <div>
          <h3 className="portfolio-subheading">{copy.education}</h3>
          <Education locale={locale} />
        </div>
      </div>
    </section>
  );
};

export default Experiences;
