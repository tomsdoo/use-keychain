import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: false,
  minify: true,
  format: ["esm"]
});
