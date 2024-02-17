interface Props {
	href: string;
	text: string;
	target?: "_blank" | "_self" | "_parent" | "_top";
}
const NavbarItem = (props: Props) => {
	return (
		<li>
			<a
				href={props.href}
				target={props.target === "_blank" ? "_blank" : ""}
				className="duration-200 px-2 py-2 rounded-lg font-semibold text-center hover:underline"
			>
				{props.text}
			</a>
		</li>
	);
};

export default NavbarItem;
