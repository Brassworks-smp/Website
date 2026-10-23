import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        nitro({ rollupConfig: { external: [/^@sentry\//] } }),
        tailwindcss(),
        fumadocsMdx({
            macro: {
                include: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
            },
        }),
        tanstackStart(),
        viteReact(),
    ],
});

export default config;
