import Button from "@/components/ui/Button";
import { IconBrandReact } from "@tabler/icons-react";
import {
	ChevronRightSquare,
	Code,
	Component,
	Database,
	Dumbbell,
	Info,
	Paintbrush2,
	Wand,
} from "lucide-react";
import { useState } from "react";
import SkillsList from "./SkillsList";
import type { ViewSkills } from "@/types";

const Skills = () => {
	const [viewSkills, setViewSkills] = useState<ViewSkills>("all");

	const handleChangeView = (name: ViewSkills) => {
		setViewSkills(name);
	};

	return (
		<div
			className="px-5 lg:px-0  lg:py-20 py-5 grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto dark:border-t-zinc-800 border-t-2"
			id="skills"
		>
			<div className="flex flex-col">
				<h2 className="font-extrabold text-5xl">
					My <span className="dark:text-green-500 text-green-700">Skills </span>
					as developer <Dumbbell className="inline h-12 w-12 text-green-600" />
				</h2>
				<p className="text-xl mt-2">
					These are the{" "}
					<span className="dark:text-green-500 text-green-700 font-bold">
						skills and technologies
					</span>{" "}
					I master, allowing me to create high-quality web applications.
				</p>

				<div className="mt-10 flex gap-3 flex-wrap">
					<Button
						variant={viewSkills === "all" ? "primary" : "secondary"}
						action={() => handleChangeView("all")}
					>
						<>
							<Component /> All
						</>
					</Button>

					<Button
						variant={viewSkills === "frontend" ? "primary" : "secondary"}
						action={() => handleChangeView("frontend")}
					>
						<>
							<Paintbrush2 /> Frontend
						</>
					</Button>

					<Button
						variant={viewSkills === "backend" ? "primary" : "secondary"}
						action={() => handleChangeView("backend")}
					>
						<>
							<ChevronRightSquare /> Backend
						</>
					</Button>

					<Button
						variant={viewSkills === "database" ? "primary" : "secondary"}
						action={() => handleChangeView("database")}
					>
						<>
							<Database /> Database
						</>
					</Button>

					<Button
						variant={viewSkills === "language" ? "primary" : "secondary"}
						action={() => handleChangeView("language")}
					>
						<>
							<Code /> Languages
						</>
					</Button>

					<Button
						variant={viewSkills === "other" ? "primary" : "secondary"}
						action={() => handleChangeView("other")}
					>
						<>
							<Wand /> Others
						</>
					</Button>
				</div>

				<p className="mt-10 opacity-80 flex items-center gap-2 border-b-2 max-w-sm pb-1 border-b-zinc-900 dark:border-b-white border-opacity-50 dark:border-opacity-30">
					<Info className="inline" />
					Tip: You can hover over each skill to know its name.
				</p>
			</div>

			<SkillsList viewSkills={viewSkills} />
		</div>
	);
};

export default Skills;
