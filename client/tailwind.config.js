/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: true,
  },
  important: "#root", // Is used in Layout.tsx to allow Tailwind styles
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "auto-fill-300": "repeat(auto-fill, 300px)",
      },
      colors: {
        primary: {
          main: "#000000",
          light: "#333333",
        },
        secondary: {
          main: "#ed6c02",
        },
        backgroundGrayLight: "#f9fafb",
        backgroundGrayDark: "#f4f5f7",
        backgroundWhite: "#ffffff",
      },
    },
  },
  plugins: [],
};
