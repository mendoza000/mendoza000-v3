import { useState } from "react";
import { Award, Flame, Sailboat } from "lucide-react";
import Button from "@/components/ui/Button";
import Jobs from "./Jobs.tsx";
import Education from "./Education.tsx";

const Experiences = () => {
	const [viewJobs, setViewJobs] = useState(true);

	const handleChangeView = (value: boolean) => {
		setViewJobs(value);
	};

	return (
		<div
			className="grid lg:grid-cols-2 gap-5 lg:gap-10 py-2 mx-auto max-w-7xl px-5 lg:px-0"
			id="experiences"
		>
			<div className="flex flex-col lg:order-last">
				<h2 className="font-extrabold text-5xl ">
					Mi{" "}
					<span className="dark:text-green-500 text-green-700">
						Experiencia y Formación
					</span>{" "}
					como desarrollador{" "}
					<Sailboat className="inline h-12 w-12 text-green-600" />
				</h2>

				<p className="text-xl mt-2 ">
					Te relato un poco sobre mi experiencia y formación como desarrollador
					web, con la que he podido{" "}
					<span className="dark:text-green-500 text-green-700 font-bold">
						mejorar mis habilidades y aprender nuevas tecnologías.
					</span>
				</p>

				<div className="flex gap-5 mt-8 flex-wrap">
					<Button
						variant={viewJobs ? "primary" : "secondary"}
						action={() => handleChangeView(true)}
					>
						<>
							<Flame className="" /> Experiencia
						</>
					</Button>
					<Button
						variant={!viewJobs ? "primary" : "secondary"}
						action={() => handleChangeView(false)}
					>
						<>
							<Award />
							Formación académica
						</>
					</Button>
				</div>
			</div>

			<div className="px-10 py-10 rounded-2xl shadow-lg overflow-y-scroll max-h-[25rem] text-white bg-gradient-to-tr from-custom-dark to-zinc-800">
				{viewJobs ? <Jobs /> : <Education />}
			</div>
		</div>
	);
};

export default Experiences;
