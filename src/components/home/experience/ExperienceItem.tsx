interface Props {
  title: string;
  date?: string;
  skills: string;
}

const ExperienceItem = ({ title, date, skills }: Props) => (
  <article className="portfolio-experience-item">
    <div className="portfolio-experience-item-heading">
      <h4>{title}</h4>
      {date && <p>{date}</p>}
    </div>
    <p>{skills}</p>
  </article>
);

export default ExperienceItem;
