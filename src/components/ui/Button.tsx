import React from "react";

interface Props {
	variant?: "secondary" | "primary" | "destroy" | "outline";
	action?: () => void;
	children: string | JSX.Element | JSX.Element[];
	class?: string | JSX.ElementClass;
}

const Button = (props: Props) => {
	return (
		<button
			className={`px-4 py-2 bg-green-800 rounded-lg gap-2 hover:gap-3 text-center hover:bg-green-700 duration-200 font-semibold flex ${
				props.class
			} ${
				props.variant === "outline"
					? "bg-transparent border-2 border-green-800 dark:text-green-500 text-green-800 hover:bg-transparent hover:border-green-700"
					: props.variant === "destroy"
					? "bg-red-500 hover:bg-red-400"
					: props.variant === "secondary"
					? "bg-zinc-800 hover:bg-zinc-700 text-white"
					: "text-white"
			}`}
			onClick={props.action}
		>
			{props.children}
		</button>
	);
};

export default Button;
