"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Apple, Monitor, Terminal, ChevronRight } from "lucide-react";
import type { DownloadLink, LauncherRelease } from "@/lib/services/launcherService";

type OS = "mac" | "windows" | "linux";
type Arch = "x64" | "arm64" | "unknown";

const OS_TABS: { id: OS; label: string; icon: React.ReactNode }[] = [
    { id: "mac", label: "macOS", icon: <Apple className="h-4 w-4" /> },
    { id: "windows", label: "Windows", icon: <Monitor className="h-4 w-4" /> },
    { id: "linux", label: "Linux", icon: <Terminal className="h-4 w-4" /> },
];

function detectOS(): OS {
    if (typeof navigator === "undefined") return "windows";
    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator.platform || "").toLowerCase();
    if (/mac|iphone|ipad|ipod/.test(ua) || platform.startsWith("mac")) return "mac";
    if (/linux|x11/.test(ua) && !/android/.test(ua)) return "linux";
    return "windows";
}

function detectArch(): Arch {
    if (typeof navigator === "undefined") return "unknown";
    const ua = navigator.userAgent.toLowerCase();
    if (/arm64|aarch64/.test(ua)) return "arm64";
    if (/x86_64|win64|wow64|x64|amd64|intel/.test(ua)) return "x64";
    return "unknown";
}

function formatSize(bytes?: number) {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

function DownloadButton({
    link,
    primary = false,
}: {
    link?: DownloadLink;
    primary?: boolean;
}) {
    if (!link) return null;
    const base =
        "font-minecraft inline-flex items-center gap-2.5 px-4 py-2.5 text-sm transition w-full sm:w-auto justify-between";
    const primaryCls =
        "text-white bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400 shadow-[0_4px_theme(colors.amber.600)] hover:bg-amber-400 hover:shadow-[0_2px_theme(colors.amber.500)] hover:translate-y-0.5";
    const secondaryCls =
        "text-zinc-100 bg-zinc-800/80 border border-zinc-700 rounded-md hover:bg-zinc-700/80";
    return (
        <Link
            href={link.url}
            className={`${base} ${primary ? primaryCls : secondaryCls}`}
        >
            <span className="inline-flex items-center gap-2.5 text-left">
                <Download className="h-4 w-4 shrink-0" />
                {link.label}
            </span>
            {link.size ? (
                <span className="text-[11px] opacity-70">{formatSize(link.size)}</span>
            ) : null}
        </Link>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="font-minecraft text-sm uppercase tracking-widest text-amber-400">
                {title}
            </h3>
            <div className="flex flex-col gap-2.5">{children}</div>
        </div>
    );
}

function InstallSteps({ steps }: { steps: React.ReactNode[] }) {
    return (
        <ol className="space-y-2.5 text-sm text-zinc-300">
            {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                    <span className="font-minecraft mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/15 text-[11px] text-amber-400">
                        {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                </li>
            ))}
        </ol>
    );
}

export function LauncherDownload({ release }: { release: LauncherRelease | null }) {
    const [os, setOs] = useState<OS>("windows");
    const [arch, setArch] = useState<Arch>("unknown");
    const [detected, setDetected] = useState(false);

    useEffect(() => {
        setOs(detectOS());
        setArch(detectArch());
        setDetected(true);
    }, []);

    const recommended: DownloadLink | undefined = useMemo(() => {
        if (!release) return undefined;
        if (os === "mac") return release.mac.universal;
        if (os === "windows")
            return arch === "arm64" ? release.windows.arm64Msi : release.windows.x64Msi;
        return arch === "arm64" ? release.linux.arm64AppImage : release.linux.x64AppImage;
    }, [release, os, arch]);

    if (!release) {
        return (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-center">
                <p className="text-zinc-300">
                    We couldn&apos;t reach GitHub to load the latest release right now.
                </p>
                <Link
                    href="https://github.com/Brassworks-smp/BrassworksLauncher/releases/latest"
                    className="mt-3 inline-block text-amber-400 underline hover:text-amber-300"
                >
                    Browse all downloads on GitHub →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {recommended && (
                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5 text-center">
                    <p className="mb-1 text-xs uppercase tracking-widest text-amber-400/80">
                        {detected ? "Detected for your system" : "Recommended"}
                    </p>
                    <div className="mt-3 flex justify-center">
                        <DownloadButton link={recommended} primary />
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">
                        Version {release.version} · not your platform? Pick below.
                    </p>
                </div>
            )}

            <div>
                <div className="mb-6 flex flex-wrap justify-center gap-2">
                    {OS_TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setOs(t.id)}
                            className={`font-minecraft inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition ${
                                os === t.id
                                    ? "border-amber-500 bg-amber-500/15 text-amber-300"
                                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                        {os === "mac" && (
                            <Section title="Download">
                                <DownloadButton link={release.mac.universal} />
                                <p className="text-xs text-zinc-500">
                                    One universal build runs natively on both Intel and Apple
                                    Silicon (M1/M2/M3) Macs.
                                </p>
                            </Section>
                        )}

                        {os === "windows" && (
                            <>
                                <Section title="64-bit (Intel / AMD)">
                                    <DownloadButton link={release.windows.x64Msi} />
                                    <DownloadButton link={release.windows.x64Exe} />
                                </Section>
                                <Section title="ARM64">
                                    <DownloadButton link={release.windows.arm64Msi} />
                                    <DownloadButton link={release.windows.arm64Exe} />
                                </Section>
                                <p className="text-xs text-zinc-500">
                                    The <strong>.msi</strong> is the standard installer; the{" "}
                                    <strong>-setup.exe</strong> is an alternative NSIS installer.
                                </p>
                            </>
                        )}

                        {os === "linux" && (
                            <>
                                <Section title="x86_64 (64-bit)">
                                    <DownloadButton link={release.linux.x64Deb} />
                                    <DownloadButton link={release.linux.x64Rpm} />
                                    <DownloadButton link={release.linux.x64AppImage} />
                                </Section>
                                <Section title="ARM64 / aarch64">
                                    <DownloadButton link={release.linux.arm64Deb} />
                                    <DownloadButton link={release.linux.arm64Rpm} />
                                    <DownloadButton link={release.linux.arm64AppImage} />
                                </Section>
                            </>
                        )}
                    </div>

                    {/* Instructions column */}
                    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                        <h3 className="font-minecraft text-lg text-zinc-100">How to install</h3>

                        {os === "mac" && (
                            <InstallSteps
                                steps={[
                                    <>Open the downloaded <strong>.dmg</strong> file.</>,
                                    <>
                                        <strong>Drag the Brassworks Launcher icon into your
                                        Applications folder.</strong>
                                    </>,
                                    <>
                                        Launch it from Applications. macOS may warn that it&apos;s
                                        from an unidentified developer.
                                    </>,
                                    <>
                                        If blocked, open{" "}
                                        <strong>System Settings → Privacy &amp; Security</strong>,
                                        scroll down and click <strong>&quot;Open Anyway&quot;</strong>{" "}
                                        next to the Brassworks Launcher prompt, then confirm.
                                    </>,
                                ]}
                            />
                        )}

                        {os === "windows" && (
                            <InstallSteps
                                steps={[
                                    <>
                                        Run the downloaded <strong>.msi</strong> (or{" "}
                                        <strong>-setup.exe</strong>) file.
                                    </>,
                                    <>
                                        If <strong>Windows SmartScreen</strong> appears, click{" "}
                                        <strong>&quot;More info&quot; → &quot;Run anyway&quot;</strong>.
                                    </>,
                                    <>Follow the installer prompts to finish setup.</>,
                                    <>Launch Brassworks Launcher from the Start menu.</>,
                                ]}
                            />
                        )}

                        {os === "linux" && (
                            <div className="space-y-5">
                                <div>
                                    <p className="font-minecraft mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-400">
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        Debian / Ubuntu / Mint / Pop!_OS
                                    </p>
                                    <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">
                                        <code>sudo apt install ./Brassworks.Launcher_*.deb</code>
                                    </pre>
                                </div>

                                <div>
                                    <p className="font-minecraft mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-400">
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        Fedora / RHEL / openSUSE
                                    </p>
                                    <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">
                                        <code>sudo dnf install ./Brassworks.Launcher-*.rpm</code>
                                    </pre>
                                </div>

                                <div>
                                    <p className="font-minecraft mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-zinc-400">
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        Arch / any distro (AppImage)
                                    </p>
                                    <pre className="overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs text-zinc-300">
                                        <code>{`chmod +x Brassworks.Launcher_*.AppImage
./Brassworks.Launcher_*.AppImage`}</code>
                                    </pre>
                                    <p className="mt-2 text-xs text-zinc-500">
                                        The AppImage is portable - no install needed. You may need{" "}
                                        <code className="text-zinc-400">libfuse2</code> on some
                                        distros.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
