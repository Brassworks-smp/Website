import { createFileRoute, notFound } from "@tanstack/react-router";
import { ApplicationPage } from "../../components/join/ApplicationPage";
import { findJoinPosition } from "../../components/join/join-config";
import { createPageMetadata } from "../../lib/seo";

export const Route = createFileRoute("/join/$positionId")({
    beforeLoad: () => {
        if (!import.meta.env.DEV) throw notFound();
    },
    loader: ({ params }) => {
        const position = findJoinPosition(params.positionId);

        if (!position) throw notFound();

        return { positionId: position.id };
    },
    head: ({ params }) => {
        const position = findJoinPosition(params.positionId);

        return createPageMetadata({
            title: position
                ? `Brassworks | Apply as ${position.title}`
                : "Brassworks | Join the Team",
            description:
                position?.summary ??
                "Apply for a voluntary position at Brassworks.",
            path: `/join/${params.positionId}`,
        });
    },
    component: ApplicationRoute,
});

function ApplicationRoute() {
    const { positionId } = Route.useLoaderData();
    const position = findJoinPosition(positionId);

    if (!position) return null;

    return <ApplicationPage position={position} />;
}
