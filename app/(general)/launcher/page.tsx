import type { Metadata } from "next";
import { LauncherDownload } from "@/components/general/launcher-download";
import {
    LauncherArchitecture,
    LauncherFeatures,
    LauncherThemes,
} from "@/components/general/launcher-sections";
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

export default async function LauncherPage() {
    const release = await getLatestLauncherRelease();

    return (
        <div className="relative mx-auto">
            <section className="px-6 pb-24 pt-28 text-zinc-100">
                <div className="container max-w-5xl mx-auto">
                    <div className="mb-12 text-center">
                        <img
                            src="/images/BrassworksLogo.png"
                            alt="Brassworks Launcher"
                            className="mx-auto mb-6 w-full max-w-md"
                            draggable={false}
                        />
                        <p className="mx-auto max-w-2xl text-zinc-400">
                            The fastest way onto the Brassworks Create SMP — instance
                            management, modpack updates, skins and more, in one native app.
                            Built with Rust and Tauri for installing, managing, and launching
                            our custom modpack as simply as possible.
                        </p>
                        {release && (
                            <p className="mt-4 text-xs uppercase tracking-widest text-amber-400/80">
                                Latest release · {release.tag}
                            </p>
                        )}
                    </div>

                    <LauncherDownload release={release} />

                    <LauncherFeatures />
                    <LauncherThemes />
                    <LauncherArchitecture />

                    <div className="mt-20 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
                        <h2 className="font-minecraft text-sm uppercase tracking-widest text-amber-400">
                            Open source
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
                            Brassworks Launcher is free and open source, licensed under the{" "}
                            <strong className="text-zinc-200">
                                GNU General Public License v3.0 or later
                            </strong>{" "}
                            (GPL-3.0-or-later).
                        </p>
                        <a
                            href="https://github.com/Brassworks-smp/BrassworksLauncher"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm text-amber-400 underline hover:text-amber-300"
                        >
                            View the source on GitHub →
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}