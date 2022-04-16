/* eslint-env node */

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker"; // error overlays when build issues arrise
import istanbul from "vite-plugin-istanbul";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log("vitejs env", env, mode);

  // base configuration should include all common settings between production and development builds
  const baseConfig = {
    publicDir: "../public",
    root: resolve(process.cwd(), "src"),
    base: "/",
    define: {
      //   https://stackoverflow.com/questions/67194082/how-can-i-display-the-current-app-version-from-package-json-to-the-user-using-vi
      // NOTE: npm_package_version comes from node when running in CLI, which sources from the package.json version field.
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  };

  if (mode === "production") {
    return {
      ...baseConfig,
      plugins: [
        react(),
        tsconfigPaths({
          projects: ["../tsconfig.prod.json"],
        }),
      ],
      build: {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: false,
      },
    };
  }

  // 'non-production' aka, development build
  return {
    ...baseConfig,
    server: {
      watch: {
        ignored: [
          "**/node_modules/**",
          "dist/**",
          "coverage/**.*",
          "coverage-reports/**.*",
          "coverage-cypress/**.*",
          "cypress/**.*",
          ".nyc_output/**",
          "**/.git/**",
          "**/.cache/**",
          "**/.temp/**",
        ],
      },
    },
    plugins: [
      react(),
      tsconfigPaths({
        projects: ["../tsconfig.dev.json"],
      }),
      checker({
        typescript: {
          tsconfigPath: "./tsconfig.dev.json",
        },
        eslint: {
          // NOTE: eslint --fix could crash the build server on errors
          lintCommand: 'eslint --cache --config "./.eslintrc.json" --fix',
        },
        overlay: {
          initialIsOpen: true,
        },
      }),
      istanbul({
        include: "src/*",
        exclude: [
          "**/node_modules/**",
          "dist/**",
          "cypress/**",
          ".nyc_output/**",
          "**/.{idea,git,cache,output,temp}/**",
          "**/__tests__/**",
          "**/*.test.*",
          "**/*.helper.*",
          "**/setupTests.js",
        ],
        extension: [".js", ".ts", ".tsx"],
        requireEnv: mode === "development" ? false : true,
      }),
    ],
    build: {
      outDir: "dist",
      sourcemap: true, // istanbul reports need this for dev
    },
  };
});
