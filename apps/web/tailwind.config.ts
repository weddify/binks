import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4a6df7",
        "primary-dark": "#3b5bdb",
        "background-light": "#f5f6f8",
        "background-dark": "#101322",
        "surface-light": "#ffffff",
        "surface-dark": "#1e2330",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      maxWidth: {
        "screen-lp": "1200px",
      },
    },
  },
  plugins: [daisyui, containerQueries, forms],
  daisyui: {
    themes: ["cupcake", "sunset"],
    darkTheme: "sunset",
  },
} satisfies Config;
