import type { Metadata } from "next";
import { LauncherDownload } from "@/components/general/launcher-download";
import { LauncherGallery } from "@/components/general/launcher-gallery";
import { getLatestLauncherRelease } from "@/lib/services/launcherService";

export const metadata: Metadata = {
    title: "Launcher",
    description:
        "Download the Brassworks Launcher for macOS, Windows and Linux. The easiest way to play on the Brassworks Create SMP.",
    openGraph: {
        title: "Brassworks Launcher",
        description:
            "Download the Brassworks Launcher for macOS, Windows and Linux. The easiest way to play on the Brassworks Create SMP.",
        url: "https://brassworks.opnsoc.org/launcher",
        type: "website",
        images: ["/images/icon.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Brassworks Launcher",
        description:
            "Download the Brassworks Launcher for macOS, Windows and Linux.",
        images: ["/images/icon.png"],
    },
};

const README_RAW = "https://raw.githubusercontent.com/Brassworks-smp/BrassworksLauncher/main";
const SCREENSHOTS = [
    { src: `${README_RAW}/assets/img_3.png`, alt: "Play menu" },
    { src: `${README_RAW}/assets/img_4.png`, alt: "Instances" },
    { src: `${README_RAW}/assets/img_5.png`, alt: "Content" },
    { src: `${README_RAW}/assets/img_6.png`, alt: "Skins" },
    { src: `${README_RAW}/assets/img_7.png`, alt: "CurseForge modpacks" },
    { src: `${README_RAW}/assets/img_8.png`, alt: "Light mode" },
];

export default async function LauncherPage() {
    const release = await getLatestLauncherRelease();

    return (
        <div className="relative mx-auto">
            <section className="px-6 pb-16 pt-28 text-zinc-100">
                <div className="container max-w-5xl mx-auto">
                    <div className="mb-12 text-center">
                        <h1 className="font-minecraft uppercase text-3xl md:text-5xl font-bold mb-4">
                            Brassworks Launcher
                        </h1>
                        <p className="mx-auto max-w-2xl text-zinc-400">
                            The fastest way onto the Brassworks Create SMP — instance
                            management, modpack updates, skins and more, in one native app.
                        </p>
                        {release && (
                            <p className="mt-4 text-xs uppercase tracking-widest text-amber-400/80">
                                Latest release · {release.tag}
                            </p>
                        )}
                    </div>

                    <LauncherDownload release={release} />
                    <div className="mt-20">
                        <h2 className="font-minecraft uppercase text-2xl md:text-3xl font-bold mb-2 text-center">
                            Screenshots
                        </h2>
                        <p className="mb-8 text-center text-zinc-400">
                            A look inside the launcher.
                        </p>
                        <LauncherGallery shots={SCREENSHOTS} />
                    </div>
                </div>
            </section>
        </div>
    );
}