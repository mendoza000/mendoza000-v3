import React from "react"
import ExperienceItem from "./ExperienceItem.tsx"

const Jobs = () => {
	return (
		<div className="border-l-4 border-zinc-800 min-h-[20rem] animate-fade">
			<div className="flex gap-5 items-center -ml-[0.65rem]">
				<div className="h-4 w-4 bg-zinc-800 rounded-full"></div>
				<h3 className="font-semibold text-2xl">Freelancer</h3>
			</div>

			<ExperienceItem
				title="Frontend Developer (Remote) - Atrinium, Spain"
				date="2024 - Present"
				skills={
					"As a frontend developer at Atrinum, I have been responsible for developing and maintaining web solutions using Next.js for projects in the insurance industry, including a software called Hermes. My role includes implementing new features, ensuring code quality and consistency by adhering to clean code principles, and delivering optimized, user-friendly interfaces. Additionally, I contributed to the development of the landing page for Flesip, focusing on a modern and responsive user experience."
				}
			/>

			<ExperienceItem
				title="Nival Digital - Landing page"
				date="2023 - 2023"
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
	)
}

export default Jobs
