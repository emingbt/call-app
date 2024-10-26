import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-bg': "#282b30",
        "lightest-bg": "#424549",
        "blue": "#7289da",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}
export default config
