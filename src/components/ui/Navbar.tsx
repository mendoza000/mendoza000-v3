import { useState } from "react";
import { Moon, MenuIcon } from "lucide-react";
import NavbarItem from "./NavbarItem.tsx";
import ToggleTheme from "./ToggleTheme.tsx";

const Navbar = () => {
	const [openMenu, setOpenMenu] = useState(false);

	const handleOpenMenu = () => {
		setOpenMenu(!openMenu);
	};

	return (
		<nav
			className={`lg:px-10 px-5 py-3 lg:py-4 fixed top-0 left-0 min-w-full flex flex-col lg:flex-row lg:justify-between z-30 bg-zinc-900 duration-300 lg:bg-opacity-0 ${
				openMenu
					? "min-h-screen bg-opacity-90 dark:bg-opacity-90 text-white"
					: " min-h-0 bg-opacity-20 dark:bg-opacity-50"
			}`}
		>
			<button disabled className="opacity-0 px-3 border-2 hidden lg:flex">
				<Moon />
			</button>

			<div
				className={`flex justify-between min-w-full lg:hidden duration-300 ${
					openMenu
						? "bg-zinc-900 bg-opacity-75 py-2 px-2 rounded-2xl shadow-xl"
						: "bg-transparent p-0 rounded-none shadow-none"
				}`}
			>
				<ToggleTheme />

				<button
					className="px-2 lg:hidden items-center justify-center inline-flex max-h-[2.5rem] duration-200"
					onClick={handleOpenMenu}
				>
					<MenuIcon />
				</button>
			</div>

			<ul
				className={`lg:border-green-800 lg:border-2 lg:rounded-xl lg:px-4 py-4 lg:py-2 lg:shadow-xl dark:shadow-lg lg:bg-green-800 bg-opacity-10 gap-5 lg:backdrop-blur-md ${
					!openMenu ? "hidden" : "flex flex-col"
				}`}
			>
				<NavbarItem href="#" text="Inicio" />
				<NavbarItem href="#experiences" text="Experiencia" />
				<NavbarItem href="#projects" text="Proyectos" />
				<NavbarItem href="#contact" text="Contacto" />
				<NavbarItem
					href="https://devstopia.vercel.app"
					target="_blank"
					text="Blog"
				/>
			</ul>

			<div className="hidden lg:flex">
				<ToggleTheme />
			</div>
		</nav>
	);
};

export default Navbar;
