import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const enableReactCompiler = false;

const reactPluginOptions = enableReactCompiler
  ? { babel: { plugins: ["babel-plugin-react-compiler"] } }
  : {};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
    react(reactPluginOptions),
  ],
});
