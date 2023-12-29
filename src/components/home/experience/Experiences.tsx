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
			className="lg:px-20 px-5 grid lg:grid-cols-2 gap-10 py-20"
			id="experiences"
		>
			<div className="flex flex-col order-last">
				<h2 className="font-extrabold text-5xl ">
					Mi{" "}
					<span className="bg-gradient-to-t from-green-800 to-green-500 bg-clip-text text-transparent">
						Experiencia y Formación
					</span>{" "}
					como desarrollador{" "}
					<Sailboat className="inline h-12 w-12 text-green-600" />
				</h2>

				<p className="text-xl mt-2 ">
					Te relato un poco sobre mi experiencia y formación como desarrollador
					web, con la que he podido{" "}
					<span className="bg-gradient-to-t from-green-800 to-green-500 bg-clip-text text-transparent font-bold">
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

			<div className="px-10 py-10 rounded-2xl shadow-lg overflow-y-scroll max-h-[25rem] text-white bg-zinc-900">
				{viewJobs ? <Jobs /> : <Education />}
			</div>
		</div>
	);
};

export default Experiences;
