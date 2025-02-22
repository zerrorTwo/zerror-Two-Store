import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://open.oapi.vn",
        changeOrigin: true,
        secure: false, // Bỏ kiểm tra SSL nếu cần
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
