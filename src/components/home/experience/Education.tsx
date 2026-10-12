import { portfolio, type Locale } from "@/content/portfolio";

const Education = ({ locale }: { locale: Locale }) => {
  const copy = portfolio[locale];
  return (
    <div className="portfolio-education">
      <p className="portfolio-education-date">2020 - Present</p>
      <p>{copy.educationCopy}</p>
    </div>
  );
};
export default Education;
