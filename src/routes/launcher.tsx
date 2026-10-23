import { createFileRoute } from "@tanstack/react-router";
import { LauncherPage } from "../components/launcher/LauncherPage";
import { createPageMetadata } from "../lib/seo";

export const Route = createFileRoute("/launcher")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | Launcher",
            description:
                "Download Brassworks Launcher for Windows, macOS, and Linux to install, manage, update, and launch Minecraft modpacks from one native app.",
            path: "/launcher",
        }),
    component: LauncherPage,
});
