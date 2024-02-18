import {
	IconBrandNodejs,
	IconBrandReact,
	IconBrandTypescript,
	IconBrandGit,
	IconBrandMongodb,
	IconBrandRedux,
	IconBrandSass,
	IconBrandJavascript,
	IconBrandNextjs,
	IconBrandVite,
	IconBrandGolang,
	IconBrandMysql,
	IconBrandVue,
	IconBrandSupabase,
} from "@tabler/icons-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SkillItem from "./SkillItem";
import type { ViewSkills } from "@/types";
import { useEffect, useState } from "react";

interface Props {
	viewSkills: ViewSkills;
}

const SkillsList = (props: Props) => {
	const iconClass: JSX.ElementClass | string = "inline h-7 w-7";
	const [selectSkills, setSelectSkills] = useState<any[]>([]);

	const skills = [
		{
			name: "react",
			category: ["frontend"],
			icon: <IconBrandReact className={iconClass} />,
		},
		{
			name: "typescript",
			category: ["frontend", "language"],
			icon: <IconBrandTypescript className={iconClass} />,
		},
		{
			name: "javascript",
			category: ["frontend", "language"],
			icon: <IconBrandJavascript className={iconClass} />,
		},
		{
			name: "redux",
			category: ["frontend"],
			icon: <IconBrandRedux className={iconClass} />,
		},
		{
			name: "sass",
			category: ["frontend"],
			icon: <IconBrandSass className={iconClass} />,
		},
		{
			name: "vue",
			category: ["frontend"],
			icon: <IconBrandVue className={iconClass} />,
		},
		{
			name: "nextjs",
			category: ["frontend"],
			icon: <IconBrandNextjs className={iconClass} />,
		},
		{
			name: "vite",
			category: ["frontend"],
			icon: <IconBrandVite className={iconClass} />,
		},
		{
			name: "git",
			category: ["other"],
			icon: <IconBrandGit className={iconClass} />,
		},
		{
			name: "nodejs",
			category: ["backend"],
			icon: <IconBrandNodejs className={iconClass} />,
		},
		{
			name: "mongodb",
			category: ["database", "backend"],
			icon: <IconBrandMongodb className={iconClass} />,
		},
		{
			name: "golang",
			category: ["backend", "language"],
			icon: <IconBrandGolang className={iconClass} />,
		},
		{
			name: "mysql",
			category: ["database", "backend"],
			icon: <IconBrandMysql className={iconClass} />,
		},
		{
			name: "supabase",
			category: ["database", "backend"],
			icon: <IconBrandSupabase className={iconClass} />,
		},
	];

	useEffect(() => {
		setSelectSkills(skills);
	}, []);

	useEffect(() => {
		if (props.viewSkills === "all") {
			setSelectSkills(skills);
		} else {
			setSelectSkills(
				skills.filter((skill) => skill.category.includes(props.viewSkills))
			);
		}
	}, [props.viewSkills]);

	return (
		<div className="rounded-2xl shadow-lg items-start  px-6 justify-center py-6 bg-gradient-to-tr from-custom-dark to-zinc-800">
			<div className="flex flex-wrap gap-4">
				{selectSkills.map((skill) => (
					<SkillItem
						viewSkills={props.viewSkills}
						name={skill.name}
						category={[...skill.category]}
					>
						{skill.icon}
					</SkillItem>
				))}
			</div>
		</div>
	);
};

export default SkillsList;
