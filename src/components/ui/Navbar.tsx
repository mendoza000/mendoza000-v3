import { useState } from "react";
import { Moon, MenuIcon } from "lucide-react";
import NavbarItem from "./NavbarItem.tsx";
import ToggleTheme from "./ToggleTheme.tsx";

// className={`lg:px-10 px-5 py-3 lg:py-4 fixed top-0 left-0 min-w-full flex flex-col lg:flex-row lg:justify-between z-30 duration-200 bg-zinc-800 dark:backdrop-blur-xl lg:dark:bg-opacity-100 ${
// 	openMenu
// 		? "min-h-screen bg-opacity-90 dark:bg-opacity-90 text-white"
// 		: " min-h-0 bg-opacity-20 dark:bg-opacity-50"
// }`}

const Navbar = () => {
	const [openMenu, setOpenMenu] = useState(false);

	const handleOpenMenu = () => {
		setOpenMenu(!openMenu);
	};

	return (
		<nav
			className={`fixed top-0 min-w-full dark:bg-zinc-800/50 bg-zinc-500/20 py-2 backdrop-blur-2xl z-10 ${
				openMenu
					? "min-h-screen bg-opacity-90 dark:bg-opacity-90 text-white"
					: " min-h-0 bg-opacity-20 dark:bg-opacity-50"
			}`}
		>
			<div className="flex justify-between px-5 max-w-7xl mx-auto flex-col lg:flex-row">
				<button disabled className="opacity-0 px-3 border-2 hidden lg:flex">
					<Moon />
				</button>

				<div
					className={`flex justify-between min-w-full lg:hidden duration-300 text-white ${
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
					className={` lg:rounded-xl lg:px-2 py-4 lg:py-2  gap-5  lg:flex dark:text-white text-zinc-900 ${
						!openMenu ? "hidden" : "flex flex-col"
					}`}
				>
					<NavbarItem href="#" text="Home" />
					<NavbarItem href="#experiences" text="Experience" />
					<NavbarItem href="#projects" text="Projects" />
					<NavbarItem href="#contact" text="Contact" />
					<NavbarItem
						href="https://devstopia.vercel.app"
						target="_blank"
						text="Blog"
					/>
				</ul>

				<div className="hidden lg:flex text-white">
					<ToggleTheme />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
