/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
theme: {
        extend: {
            screens: {
                xs: "300px",
            },
            colors: {
                primary_green: {
                    DEFAULT: "#0C7157",
                    light: "#E6F1EE",
                },
                desc_gray: {
                    DEFAULT: "#7B7B7B",
                },
                title_black: {
                    DEFAULT: "#212121",
                },
            },
            fontFamily: {
                poppins: ["var(--font-poppins)"],
            },
        },
    },
    plugins: [],
}
