import React from "react";
import ExperienceItem from "./ExperienceItem.tsx";

const Jobs = () => {
	return (
		<div className="border-l-4 border-zinc-800 min-h-[20rem]">
			<div className="flex gap-5 items-center -ml-[0.65rem]">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Freelancer</h3>
			</div>
			<p className=" opacity-70 ml-6">2023</p>

			<ExperienceItem
				title="Nival Digital - Landing page"
				date="05-2023 - 06-2023"
				skills={["NextJS", "Typescript", "TailwindCSS", "Zustand"]}
			/>

			<div className="flex gap-5 items-center -ml-[0.65rem] mt-5">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Proyectos personales</h3>
			</div>
			<p className=" opacity-70 ml-6">2020 - Actualidad</p>
		</div>
	);
};

export default Jobs;
