import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import license from "rollup-plugin-license";
import path from "path";
import resolve, { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: ["src/index.js"],
  output: [
    {
      dir: "dist",
      esModule: true,
      exports: "auto",
      format: "esm",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [
    commonjs({
      exclude: "node_modules",
    }),

    nodeResolve({ preferBuiltins: true, extensions: [".svg", ".js"] }),
    json(),
    resolve(),
  ],
};
