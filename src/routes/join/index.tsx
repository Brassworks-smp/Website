import { createFileRoute, notFound } from "@tanstack/react-router";
import { JoinPage } from "../../components/join/JoinPage";
import { createPageMetadata } from "../../lib/seo";

export const Route = createFileRoute("/join/")({
    beforeLoad: () => {
        if (!import.meta.env.DEV) throw notFound();
    },
    head: () =>
        createPageMetadata({
            title: "Brassworks | Join the Team",
            description:
                "Apply for a voluntary position at Brassworks - development, web, content, media, moderation, assistance, or building.",
            path: "/join",
        }),
    component: JoinPage,
});
