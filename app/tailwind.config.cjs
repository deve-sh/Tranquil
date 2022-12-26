/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
		textColor: {
			white: colors.white,
			gray: colors.gray,
			slate: colors.slate,
			emerald: colors.emerald,
			red: colors.red,
		},
		colors: {
			stone: colors.stone,
			sky: colors.sky,
			neutral: colors.neutral,
			gray: colors.gray,
			slate: colors.slate,
			black: colors.black,
			white: colors.white,
			red: colors.red,
			blue: colors.blue,
			editor: "#263238",
			editorpane: "#246b67",
			transparent: "transparent",
			teal: colors.teal,
			emerald: colors.emerald,
		},
	},
	plugins: [],
};
