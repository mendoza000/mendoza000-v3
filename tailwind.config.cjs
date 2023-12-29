const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Subjectivity", "Inter", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				"custom-dark": "#171717",
				"custom-light": "#f9f4ef",
			},
			keyframes: {
				bouncezzz: {
					"0%, 100%": { transform: "translateY(10%)" },
					"50%": { transform: "translateY(-0%)" },
				},
			},
			animation: {
				"bounce-slow": "bouncezzz 2s ease-in-out infinite",
				"bounce-slow-2": "bouncezzz 2.5s ease-in-out infinite",
				"bounce-slow-3": "bouncezzz 3s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
