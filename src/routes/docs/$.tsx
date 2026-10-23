import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { createServerFn } from "@tanstack/react-start";
import { docs, source } from "@/lib/source";
import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { baseOptions } from "@/lib/layout.shared";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { ChevronDown } from "lucide-react";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { useMDXComponents } from "@/components/mdx";
import { Header } from "@/components/general/Header";
import { Footer } from "@/components/general/Footer";
import { createPageMetadata } from "@/lib/seo";
import "@/styles/docs.css";

export const Route = createFileRoute("/docs/$")({
    component: Page,
    loader: async ({ params }) => {
        const slugs = params._splat?.split("/") ?? [];
        const data = await serverLoader({ data: slugs });
        await docs.getPage(data.path)?.preload();
        return data;
    },
    head: ({ loaderData }) =>
        createPageMetadata({
            title: loaderData
                ? `Brassworks | ${loaderData.title}`
                : "Brassworks | Docs",
            description:
                loaderData?.description ||
                "Guides, setup help, and reference documentation for Brassworks.",
            path: loaderData?.url ?? "/docs",
        }),
});

const serverLoader = createServerFn({
    method: "GET",
})
    .validator((slugs: string[]) => slugs)
    .handler(async ({ data: slugs }) => {
        const page = source.getPage(slugs);
        if (!page) throw notFound();

        return {
            path: page.path,
            url: page.url,
            title: page.data.title,
            description: page.data.description ?? "",
            pageTree: await source.serializePageTree(source.getPageTree()),
        };
    });

type TocItem = {
    title: ReactNode;
    url: string;
    depth: number;
};

function MobileTableOfContents({ toc }: { toc: TocItem[] }) {
    const [open, setOpen] = useState(false);
    const [activeUrl, setActiveUrl] = useState(toc[0]?.url ?? "");

    useEffect(() => {
        const update = () => {
            let current = toc[0]?.url ?? "";

            for (const item of toc) {
                const heading = document.getElementById(
                    decodeURIComponent(item.url.slice(1)),
                );

                if (heading && heading.getBoundingClientRect().top <= 140) {
                    current = item.url;
                }
            }

            setActiveUrl(current);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });

        return () => window.removeEventListener("scroll", update);
    }, [toc]);

    if (toc.length === 0) return null;

    return (
        <div className="mb-2 border-y border-white/8 py-4 xl:hidden">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center justify-between gap-4 font-minecraft text-[11px] font-bold uppercase tracking-[0.12em] text-[#d9b86e]"
            >
                On this page
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <nav aria-label="Page contents" className="pt-3">
                        <ol className="mt-1 border-l border-white/10">
                            {toc.map((item) => {
                                const active = item.url === activeUrl;

                                return (
                                    <li key={item.url}>
                                        <a
                                            href={item.url}
                                            onClick={() => setOpen(false)}
                                            aria-current={
                                                active ? "location" : undefined
                                            }
                                            className={`site-interactive -ml-px block border-l py-2 text-sm leading-5 transition-[border-color,color,transform] ${
                                                item.depth <= 2
                                                    ? "pl-4 font-semibold"
                                                    : item.depth === 3
                                                      ? "pl-7 text-[13px]"
                                                      : "pl-10 text-xs"
                                            } ${
                                                active
                                                    ? "translate-x-0.5 border-[#d9b86e] text-white"
                                                    : "border-transparent text-white/42 hover:border-white/20 hover:text-white/72"
                                            }`}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    );
}

function Content({ path }: { path: string }) {
    const page = docs.getPage(path);
    if (!page) throw new Error(`unknown page: ${path}`);

    const { toc } = page;
    const MDX = page.body;

    return (
        <DocsPage toc={toc}>
            <DocsTitle>{page.title}</DocsTitle>
            <DocsDescription>{page.description}</DocsDescription>
            <MobileTableOfContents toc={toc} />
            <DocsBody>
                <MDX components={useMDXComponents()} />
            </DocsBody>
        </DocsPage>
    );
}

function Page() {
    const data = useFumadocsLoader(Route.useLoaderData());

    return (
        <div className="docs-theme dark font-sans">
            <Header />
            <DocsLayout
                {...baseOptions()}
                tree={data.pageTree}
                sidebar={{ collapsible: false }}
            >
                <Suspense>
                    <Content path={data.path} />
                </Suspense>
            </DocsLayout>
            <Footer />
        </div>
    );
}
