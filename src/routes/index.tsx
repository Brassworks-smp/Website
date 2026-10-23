import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/general/Header.tsx";
import { HeroSection } from "../components/general/HeroSection.tsx";
import { CreationsSection } from "../components/general/CreationsSection.tsx";
import { ModsSection } from "../components/general/ModsSection.tsx";
import { TeamSection } from "../components/general/TeamSection.tsx";
import { NewsSection } from "../components/general/NewsSection.tsx";
import { MediaSection } from "../components/general/MediaSection.tsx";
import { ClosingSection } from "../components/general/ClosingSection.tsx";
import { Footer } from "../components/general/Footer.tsx";
import { createPageMetadata } from "../lib/seo.ts";

export const Route = createFileRoute("/")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | Made to Create",
            description:
                "Discover Brassworks mods, modpacks, community projects, news, media, and the Brassworks Launcher.",
            path: "/",
        }),
    component: IndexRoute,
});

function IndexRoute() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <HeroSection />
                <CreationsSection />
                <ModsSection />
                <TeamSection />
                <NewsSection />
                <MediaSection />
                <ClosingSection />
            </main>
            <Footer />
        </>
    );
}
