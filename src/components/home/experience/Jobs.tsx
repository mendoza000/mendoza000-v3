import React from "react";
import ExperienceItem from "./ExperienceItem.tsx";

const Jobs = () => {
	return (
		<div className="border-l-4 border-zinc-800 min-h-[20rem] animate-fade">
			<div className="flex gap-5 items-center -ml-[0.65rem]">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Freelancer</h3>
			</div>
			<p className=" opacity-70 ml-6">2023</p>

			<ExperienceItem
				title="Nival Digital - Landing page"
				date="05-2023 - 06-2023"
				skills={
					"I was hired as a freelance developer to build the landing page for a client's company named Nival Digital. I utilized technologies such as React, NextJS, TailwindCSS, TypeScript, among others, to successfully complete this project"
				}
			/>

			<div className="flex gap-5 items-center -ml-[0.65rem] mt-5">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Personal projects</h3>
			</div>
			<p className=" opacity-70 ml-6">2020 - Present</p>
		</div>
	);
};

export default Jobs;
