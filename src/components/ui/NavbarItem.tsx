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
				className="bg-green-800 bg-opacity-0 hover:bg-opacity-40 duration-200 px-2 py-1 rounded-lg font-semibold"
			>
				{props.text}
			</a>
		</li>
	);
};

export default NavbarItem;
