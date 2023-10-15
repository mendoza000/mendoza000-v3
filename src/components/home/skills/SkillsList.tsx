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
import React from "react";
import SkillItem from "./SkillItem";
import type { ViewSkills } from "@/types";

interface Props {
	viewSkills: ViewSkills;
}

const SkillsList = (props: Props) => {
	const iconClass: JSX.ElementClass | string = "inline h-7 w-7";

	return (
		<div className="rounded-2xl shadow-lg items-start bg-gradient-to-tr px-6 justify-center py-6 from-green-500 to-green-950">
			<div className="flex flex-wrap gap-4">
				<SkillItem
					viewSkills={props.viewSkills}
					name="react"
					category={["frontend"]}
				>
					<IconBrandReact className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="typescript"
					category={["frontend", "language"]}
				>
					<IconBrandTypescript className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="javascript"
					category={["frontend", "language"]}
				>
					<IconBrandJavascript className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="redux"
					category={["frontend"]}
				>
					<IconBrandRedux className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="sass"
					category={["frontend"]}
				>
					<IconBrandSass className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="vue"
					category={["frontend"]}
				>
					<IconBrandVue className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="nextjs"
					category={["frontend"]}
				>
					<IconBrandNextjs className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="vite"
					category={["frontend"]}
				>
					<IconBrandVite className={iconClass} />
				</SkillItem>
				<SkillItem
					viewSkills={props.viewSkills}
					name="git"
					category={["other"]}
				>
					<IconBrandGit className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="nodejs"
					category={["backend"]}
				>
					<IconBrandNodejs className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="mongodb"
					category={["database", "backend"]}
				>
					<IconBrandMongodb className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="golang"
					category={["backend", "language"]}
				>
					<IconBrandGolang className={iconClass} />
				</SkillItem>

				<SkillItem
					viewSkills={props.viewSkills}
					name="mysql"
					category={["database", "backend"]}
				>
					<IconBrandMysql className={iconClass} />
				</SkillItem>
				<SkillItem
					viewSkills={props.viewSkills}
					name="supabase"
					category={["database", "backend"]}
				>
					<IconBrandSupabase className={iconClass} />
				</SkillItem>
			</div>
		</div>
	);
};

export default SkillsList;
