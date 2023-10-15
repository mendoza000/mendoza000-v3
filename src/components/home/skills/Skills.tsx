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
			className="px-5 lg:px-20 lg:py-20 py-5 grid lg:grid-cols-2 gap-10 dark:border-t-zinc-800 border-t-2"
			id="skills"
		>
			<div className="flex flex-col">
				<h2 className="font-extrabold text-5xl">
					Mis{" "}
					<span className="bg-gradient-to-t from-green-800 to-green-500 bg-clip-text text-transparent">
						Habilidades{" "}
					</span>
					como desarrollador{" "}
					<Dumbbell className="inline h-12 w-12 text-green-600" />
				</h2>
				<p className="text-xl mt-2">
					Estas son las{" "}
					<span className="bg-gradient-to-t from-green-800 to-green-500 bg-clip-text text-transparent font-bold">
						habilidades y tecnologias
					</span>{" "}
					que domino y que me permiten crear aplicaciones web de alta calidad.
				</p>

				<div className="mt-10 flex gap-3 flex-wrap">
					<Button
						variant={viewSkills === "all" ? "primary" : "secondary"}
						action={() => handleChangeView("all")}
					>
						<>
							<Component /> Todas
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
							<Code /> Lenguajes
						</>
					</Button>

					<Button
						variant={viewSkills === "other" ? "primary" : "secondary"}
						action={() => handleChangeView("other")}
					>
						<>
							<Wand /> Otros
						</>
					</Button>
				</div>

				<p className="mt-10 opacity-80 flex items-center gap-2 border-b-2 max-w-lg pb-1 border-b-zinc-900 dark:border-b-white border-opacity-50 dark:border-opacity-30">
					<Info className="inline" />
					Tip: puedes ubicar el mouse sobre cada skill para saber su nombre
				</p>
			</div>

			<SkillsList viewSkills={viewSkills} />
		</div>
	);
};

export default Skills;
