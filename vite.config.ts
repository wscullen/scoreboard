import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/scoreboard/", // TODO: If you add a custom domain without a subpath, remove this line
});
