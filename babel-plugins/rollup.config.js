import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import path from "path";

const root = process.cwd();

export default {
    input: "src/momo.ts",
    output: {
        file: "lib/index.js",
        format: "cjs",
        sourcemap: true
    },
    plugins: [
        typescript({
            tsconfig: path.resolve(root, "tsconfig.json"),
            rollupCommonJSResolveHack: false,
            clean: true,
            useTsconfigDeclarationDir: true,
        }),
        // babel({ exclude: "node_modules/**" }),
    ],
};
