import RoadmapUI from "@/components/roadmap/roadmap";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Brassworks - Roadmap",
    description: "A quick overview of upcoming features, planned updates, and ongoing improvements shaping the future of our SMP experience.",
    openGraph: {
        title: "Brassworks - Roadmap",
        description: "A quick overview of upcoming features, planned updates, and ongoing improvements shaping the future of our SMP experience.",
        url: "https://brassworks.opnsoc.org/roadmap",
        type: "website",
        images: ["/images/icon.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Brassworks - Roadmap",
        description: "A quick overview of upcoming features, planned updates, and ongoing improvements shaping the future of our SMP experience.",
        images: ["/images/icon.png"],
    },
};

export default function Home() {
    return (
        <div className="relative mx-auto">
            <RoadmapUI/>
        </div>
    );
}