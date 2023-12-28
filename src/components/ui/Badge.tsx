import React from "react";

// create badge props interface
interface BadgeProps {
	children: React.ReactNode;
	color: string;
	rest?: any;
}

export default function Badge(props: BadgeProps) {
	const { children, color, ...rest } = props;

	return (
		<div>
			<span
				className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm justify-center font-medium bg-green-500/20 `}
				{...rest}
			>
				{children}
			</span>
		</div>
	);
}
