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
				className="bg-green-800 bg-opacity-0 hover:bg-opacity-70 duration-200 px-2 py-2 rounded-lg font-semibold text-center"
			>
				{props.text}
			</a>
		</li>
	);
};

export default NavbarItem;
