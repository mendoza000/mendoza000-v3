import ExperienceItem from "./ExperienceItem.tsx";

const Education = () => {
	return (
		<div className="border-l-4 border-zinc-800 min-h-[20rem]">
			<div className="flex gap-5 items-center -ml-[0.65rem]">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Formación academica</h3>
			</div>
			<p className=" opacity-70 ml-6">2020 - Actualidad</p>

			<ExperienceItem title="Ingenieria en Informatica" date="2023-2027" />
			<ExperienceItem title="Go - Platzi" date="2023" />
			<ExperienceItem title="Vue3 - Platzi" date="2023" />
			<ExperienceItem title="Typescript - Platzi" date="2023" />
			<ExperienceItem title="NextJS - Platzi" date="2023" />
			<ExperienceItem title="React - Fernando Herrera" date="2022" />
			<ExperienceItem title="NodeJS - Fernando Herrera" date="2021" />
			<ExperienceItem title="Javascript - Fernando Herrera" date="2021" />
		</div>
	);
};

export default Education;
