import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "../components/roadmap/RoadmapPage";
import { createPageMetadata } from "../lib/seo";

export const Route = createFileRoute("/roadmap")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | Roadmap",
            description:
                "Track planned, active, testing, completed, and released work across Brassworks projects.",
            path: "/roadmap",
        }),
    component: RoadmapPage,
});
