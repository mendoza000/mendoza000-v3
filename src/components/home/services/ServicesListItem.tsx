interface Props {
	children: string | JSX.Element | JSX.Element[];
	title: string;
	desciption: string;
}

const ServicesListItem = (props: Props) => {
	return (
		<div className="dark:bg-zinc-800 px-5 py-5 rounded-2xl bg-white shadow-xl">
			<div className="dark:bg-zinc-900 px-3 py-3 inline-flex items-center justify-center rounded-xl bg-zinc-200">
				{props.children}
			</div>
			<h4 className="font-bold text-xl mt-3">{props.title}</h4>
			<p className="mt-3 dark:opacity-70 opacity-80">{props.desciption}</p>
		</div>
	);
};

export default ServicesListItem;
