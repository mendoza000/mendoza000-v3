import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

type SkillCategory =
	| "frontend"
	| "backend"
	| "database"
	| "other"
	| "all"
	| "language";

interface Props {
	name: string;
	category: SkillCategory[] | string[];
	viewSkills: SkillCategory;
	children: React.ReactNode;
}

const SkillItem = (props: Props) => {
	return (
		<>
			<span
				className={`dark:bg-zinc-900 px-3 py-3 rounded-xl bg-white inline items-center justify-center shadow-lg dark:hover:bg-zinc-800 duration-200 ${
					props.category.includes(props.viewSkills) ||
					props.viewSkills === "all"
						? ""
						: ""
				}`}
				data-tooltip-id={props.name}
				data-tooltip-content={props.name.toUpperCase()}
				data-tooltip-place="top"
			>
				{props.children}
			</span>
			<Tooltip
				id={props.name}
				style={{
					borderRadius: "0.5rem",
					backgroundColor: "#27272a",
				}}
				opacity={1}
			/>
		</>
	);
};

export default SkillItem;
