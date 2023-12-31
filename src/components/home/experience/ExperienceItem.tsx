import React from "react";

interface Props {
	title?: string;
	date?: string;
	skills?: string;
}

const ExperienceItem = (props: Props) => {
	return (
		<div className="ml-6 mt-5">
			<div className="flex items-center gap-2 -ml-7">
				<div className="h-1 w-5 bg-zinc-800"></div>
				<h4 className="font-semibold text-green-500">{props.title}</h4>
			</div>
			<p className="text-sm opacity-50">{props.date}</p>

			<ul className="mt-3 opacity-90 list-none ml-6">
				<li>{props.skills}</li>
			</ul>
		</div>
	);
};

export default ExperienceItem;
