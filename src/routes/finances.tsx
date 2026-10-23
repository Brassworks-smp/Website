import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "../components/finances/FinancePage";
import { createPageMetadata } from "../lib/seo";

export const Route = createFileRoute("/finances")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | Finances",
            description:
                "Explore Brassworks income, expenses, and their detailed breakdown.",
            path: "/finances",
        }),
    component: FinancePage,
});
