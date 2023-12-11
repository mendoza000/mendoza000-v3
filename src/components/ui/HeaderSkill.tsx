import React from "react";

interface Props {
	children: string | JSX.Element | JSX.Element[];
	className: JSX.ElementClass | string;
	position: JSX.ElementClass | string;
}

const HeaderSkill = (props: Props) => {
	return (
		<div className={`absolute  ${props.position}`}>
			<div
				className={`px-4 py-6 bg-opacity-20 rounded-xl shadow-md backdrop-blur-lg ${props.className}`}
			>
				{props.children}
			</div>

			{/* <div className="w-24 h-3 bg-yellow-500 bg-opacity-20 rounded-full animate-bounce-slow-2"></div> */}
		</div>
	);
};

export default HeaderSkill;
