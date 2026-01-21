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
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#066A9E",
        "primary-light": "#E6F3F5",
        "text-dark": "#333333",
        "text-gray": "#808080",
        "border-gray": "#B9B9B9",
        "border-light": "#E1E1E1",
        "avatar-bg": "#8EC5D0",
      },
      fontFamily: {
        sans: ["var(--font-noto)", "var(--font-noto-jp)", "sans-serif"],
        noto: ["var(--font-noto)", "var(--font-noto-jp)", "sans-serif"],
        "noto-jp": ["var(--font-noto-jp)", "sans-serif"],
        inter: ["var(--font-inter)", "var(--font-noto-jp)", "sans-serif"],
      },
      boxShadow: {
        header: "0px 4px 15px rgba(0, 0, 0, 0.05)",
        tab: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        sidebar: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        input: "0px 4px 15px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        blink: {
          "0%, 50%": {
            opacity: "1",
          },
          "51%, 100%": {
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        blink: "blink 1s infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};

export default config;
