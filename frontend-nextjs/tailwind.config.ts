import type { Config } from "tailwindcss";

interface DaisyUIConfig {
  themes?: string[];
  darkTheme?: string;
  base?: boolean;
  styled?: boolean;
  utils?: boolean;
  prefix?: string;
  logs?: boolean;
  themeRoot?: string;
}

type ConfigWithDaisyUI = Config & {
  daisyui?: DaisyUIConfig;
};

const config: ConfigWithDaisyUI = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
    themeRoot: ":root",
  },
};

export default config;
