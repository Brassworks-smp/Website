import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: <span className="font-minecraft uppercase">Wiki</span>,
            url: "/docs",
        },
        themeSwitch: {
            enabled: false,
        },
    };
}
