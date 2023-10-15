import React from "react";

interface Props {
	children: string | JSX.Element | JSX.Element[];
	className: JSX.ElementClass | string;
}

const HeaderSkill = (props: Props) => {
	return (
		<div
			className={`px-4 py-6 bg-opacity-20 rounded-lg absolute backdrop-blur-lg ${props.className}`}
		>
			{props.children}
		</div>
	);
};

export default HeaderSkill;
