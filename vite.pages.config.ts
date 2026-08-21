import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/medical-equipment-dashboard/",
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "pages-dist",
    emptyOutDir: true,
  },
});
