import { Moon, Sun } from "lucide-react";
import { useState } from "react";

const ToggleTheme = () => {
	const [isDark, setIsDark] = useState(
		localStorage.getItem("theme") === "dark" ? true : false
	);

	const handleToggleTheme = () => {
		const header = document.getElementById("header");
		setIsDark(!isDark);

		document.documentElement.classList.remove(!isDark ? "light" : "dark");
		document.documentElement.classList.add(!isDark ? "dark" : "light");

		header?.classList.remove(!isDark ? "header-bg" : "header-bg-dark");
		header?.classList.add(!isDark ? "header-bg-dark" : "header-bg");

		localStorage.setItem("theme", !isDark ? "dark" : "light");
	};

	return (
		<button
			className="bg-green-800 bg-opacity-10 border-green-800 border-2 px-3 rounded-xl hover:bg-opacity-40 duration-200 backdrop-blur-md py-1 inline-flex max-h-[2.5rem] items-center justify-center"
			onClick={handleToggleTheme}
		>
			{!isDark ? <Moon /> : <Sun />}
		</button>
	);
};

export default ToggleTheme;
