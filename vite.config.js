import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // 🔥 Esto es importante para que Vercel sirva los archivos correctamente
  build: {
    outDir: "dist", // ⚠️ Asegura que los archivos generados se almacenen en "dist"
  },
});
