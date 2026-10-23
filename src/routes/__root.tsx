import {
    createRootRouteWithContext,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../lib/queries/devtools.js";
import { DeveloperHint } from "../components/general/DeveloperHint";
import { NotFoundPage } from "../components/general/NotFoundPage";
import { SiteReveal } from "../components/general/SiteReveal";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { RootProvider } from "fumadocs-ui/provider/tanstack";

interface MyRouterContext {
    queryClient: QueryClient;
}

const INITIAL_SCROLL_SCRIPT = `
    try {
        document.documentElement.dataset.siteTheme = "brass";
    } catch {
        document.documentElement.dataset.siteTheme = "brass";
    }
    try {
        if (window.sessionStorage.getItem("brassworks-header-built")) {
            document.documentElement.dataset.headerBuilt = "true";
        } else {
            window.sessionStorage.setItem("brassworks-header-built", "true");
        }
    } catch {}
    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                name: "theme-color",
                content: "#171614",
            },
        ],
        links: [
            {
                rel: "preload",
                href: "/fonts/minecraft-regular.woff2",
                as: "font",
                type: "font/woff2",
                crossOrigin: "anonymous",
            },
            {
                rel: "preload",
                href: "/fonts/minecraft-bold.woff2",
                as: "font",
                type: "font/woff2",
                crossOrigin: "anonymous",
            },
            {
                rel: "stylesheet",
                href: appCss,
            },
            {
                rel: "icon",
                href: "/favicon.ico",
            },
        ],
    }),
    notFoundComponent: NotFoundPage,
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-site-theme="brass" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{ __html: INITIAL_SCROLL_SCRIPT }}
                />
                <HeadContent />
            </head>
            <body>
                <DeveloperHint />
                <SiteReveal />
                <RootProvider>{children}</RootProvider>
                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                        TanStackQueryDevtools,
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
