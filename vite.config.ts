/* eslint-env node */

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import checker from "vite-plugin-checker"; // error overlays when build issues arrise
import istanbul from "vite-plugin-istanbul";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("vitejs env", env, mode);
  return {
    // build specific config
    root: process.cwd(),
    base: "/",
    // plugin order of the checker vs react+tsconfig paths doesn't seem to matter
    plugins: [
      react(),
      tsconfigPaths(),
      // checker({
      //   typescript: true,
      //   eslint: {
      //     // NOTE: eslint --fix could crash the build server on errors
      //     lintCommand: 'eslint --config ".eslintrc.json" --config ".eslint-dev-rules.json" "./src/" --fix',
      //   },
      //   overlay: {
      //     initialIsOpen: true,
      //   },
      // }),
      istanbul({
        include: "src/*",
        exclude: [
          "**/node_modules/**",
          "**/dist/**",
          "**/cypress/**",
          "**/.{idea,git,cache,output,temp}/**",
          "**/__tests__/**",
          "**/*.test.*",
          "**/*.helper.*",
          "src/setupTests.js",
        ],
        extension: [".js", ".ts", ".tsx"],
        requireEnv: mode === "development" ? false : true,
      }),
    ],
    publicDir: "public",
    define: {
      //   https://stackoverflow.com/questions/67194082/how-can-i-display-the-current-app-version-from-package-json-to-the-user-using-vi
      // NOTE: npm_package_version comes from node when running in CLI, which sources from the package.json version field.
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
