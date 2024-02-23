import ExperienceItem from "./ExperienceItem.tsx";

const Education = () => {
	return (
		<div className=" border-zinc-800 min-h-[20rem] animate-fade">
			<div className="flex gap-5 items-center">
				<h3 className="font-semibold text-2xl">Formación académica</h3>
			</div>
			<p className=" opacity-70">2020 - Actualidad</p>

			<p className=" mt-5">
				I have pursued a Bachelor's degree in Computer Engineering from UPTAI
				from 2023. Additionally, I have undertaken various courses on platforms
				such as Platzi and Udemy. These courses have covered a range of topics
				including Go, Vue3, Typescript, and NextJS, all completed in 2023.
				Furthermore, I have delved into programming languages and frameworks
				through courses by renowned instructor Fernando Herrera, including
				React, NodeJS, and Javascript, completed in 2021 and 2022 respectively.
			</p>
		</div>
	);
};

export default Education;
