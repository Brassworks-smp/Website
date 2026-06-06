import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Brassworks - Live Map',
    description:
        'See our SMP world unfold in real time: track player activity, explore builds, follow roads and regions, and watch the Brassworks community shape the landscape together.',
    openGraph: {
        title: "Brassworks - Live Map",
        description: "See our SMP world unfold in real time: track player activity, explore builds, follow roads and regions, and watch the Brassworks community shape the landscape together.",
        url: "https://brassworks.opn-soc.org/map",
        type: "website",
        images: ["/images/icon.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Brassworks - Live Map",
        description: "See our SMP world unfold in real time: track player activity, explore builds, follow roads and regions, and watch the Brassworks community shape the landscape together.",
        images: ["/images/icon.png"],
    },
};

export default function Map() {
    return (
        <section className="relative justify-center overflow-hidden">
            <iframe src="https://brassmap.opn-soc.org/" width="100%" className="h-[calc(100vh-2.5rem)]">
            </iframe>
        </section>
    );
}