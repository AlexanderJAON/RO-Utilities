import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // ⚠️ Asegura rutas relativas en producción
  build: {
    outDir: "dist", // Asegura que la carpeta de salida sea 'dist'
  },
  server: {
    port: 5173, // O el puerto que prefieras para desarrollo
  },
});

