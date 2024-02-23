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
					My{" "}
					<span className="dark:text-green-500 text-green-700">
						Experience and Training
					</span>{" "}
					as a Developer{" "}
					<Sailboat className="inline h-12 w-12 text-green-600" />
				</h2>

				<p className="text-xl mt-2 ">
					I'll tell you a bit about my experience and training as a web
					developer, through which I've been able to{" "}
					<span className="dark:text-green-500 text-green-700 font-bold">
						enhance my skills and learn new technologies.
					</span>
				</p>

				<div className="flex gap-5 mt-8 flex-wrap">
					<Button
						variant={viewJobs ? "primary" : "secondary"}
						action={() => handleChangeView(true)}
					>
						<>
							<Flame className="" /> Experience
						</>
					</Button>
					<Button
						variant={!viewJobs ? "primary" : "secondary"}
						action={() => handleChangeView(false)}
					>
						<>
							<Award />
							Academic Background
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
