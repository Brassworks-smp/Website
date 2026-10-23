import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";

export const docs = defineDocs({
    dir: "src/docs",
});

export const source = loader({
    baseUrl: "/docs",
    source: docs.toFumadocsSource(),
});
