"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket, Download, Package, MemoryStick, Cpu, ShieldCheck, ExternalLink } from "lucide-react";

export interface InstallInfo {
    deepLink: string;
    name: string;
    description?: string;
    icon?: string;
    packUrl?: string;
    minMemoryMb?: string;
    maxMemoryMb?: string;
    jvmArgs?: string;
    unsup?: boolean;
}

function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 border-t border-zinc-800/80 py-3 first:border-t-0">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/60 text-amber-400">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="font-minecraft text-[11px] uppercase tracking-widest text-zinc-500">
                    {label}
                </p>
                <p className="break-words text-sm text-zinc-200">{value}</p>
            </div>
        </div>
    );
}

export function InstallLanding(info: InstallInfo) {
    const [launched, setLaunched] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => {
            window.location.href = info.deepLink;
        }, 700);
        return () => clearTimeout(t);
    }, []);

    const memory =
        info.minMemoryMb && info.maxMemoryMb
            ? `${info.minMemoryMb} MB – ${info.maxMemoryMb} MB`
            : info.maxMemoryMb
            ? `up to ${info.maxMemoryMb} MB`
            : info.minMemoryMb
            ? `from ${info.minMemoryMb} MB`
            : null;

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-7">
                <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
                <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                    {info.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={info.icon}
                            alt={info.name}
                            className="pixelated mb-4 h-24 w-24 shrink-0 rounded-2xl border border-zinc-700 bg-zinc-900 object-cover sm:mb-0"
                            draggable={false}
                        />
                    ) : (
                        <div className="mb-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 sm:mb-0">
                            <Package className="h-10 w-10" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-widest text-amber-400/80">
                            Modpack install link
                        </p>
                        <h1 className="font-minecraft mt-1 text-2xl font-bold text-zinc-100">
                            {info.name}
                        </h1>
                        {info.description && (
                            <p className="mt-2 max-w-xl text-sm text-zinc-400">
                                {info.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <a
                        href={info.deepLink}
                        onClick={() => setLaunched(true)}
                        className="font-minecraft inline-flex w-full items-center justify-center gap-2.5 border border-amber-600 bg-amber-500 px-5 py-3 text-sm text-white shadow-[0_4px_theme(colors.amber.600)] ring-2 ring-inset ring-amber-400 transition hover:translate-y-0.5 hover:bg-amber-400 hover:shadow-[0_2px_theme(colors.amber.500)] sm:w-auto"
                    >
                        <Rocket className="h-4 w-4" />
                        Open in Brassworks Launcher
                    </a>
                </div>

                <p className="relative mt-4 text-center text-xs text-zinc-500">
                    {launched
                        ? "Launching… if nothing happens, make sure the launcher is installed."
                        : "Your browser may ask for permission to open the Brassworks Launcher."}
                </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="font-minecraft text-sm uppercase tracking-widest text-amber-400">
                    Pack details
                </h2>
                <div className="mt-3">
                    {info.packUrl && (
                        <DetailRow
                            icon={<Package className="h-4 w-4" />}
                            label="Pack source"
                            value={
                                <a
                                    href={info.packUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-400 hover:text-amber-300"
                                >
                                    {info.packUrl}
                                </a>
                            }
                        />
                    )}
                    {memory && (
                        <DetailRow
                            icon={<MemoryStick className="h-4 w-4" />}
                            label="Memory"
                            value={memory}
                        />
                    )}
                    {info.jvmArgs && (
                        <DetailRow
                            icon={<Cpu className="h-4 w-4" />}
                            label="JVM arguments"
                            value={
                                <code className="text-xs text-zinc-300">{info.jvmArgs}</code>
                            }
                        />
                    )}
                    {info.unsup && (
                        <DetailRow
                            icon={<ShieldCheck className="h-4 w-4" />}
                            label="Updates"
                            value="unsup resumable, hash-verified updates enabled"
                        />
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
                <p className="text-sm text-zinc-400">
                    Don&apos;t have the launcher yet?
                </p>
                <Link
                    href="/launcher"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-amber-400 underline hover:text-amber-300"
                >
                    <Download className="h-4 w-4" />
                    Download the Brassworks Launcher
                </Link>
                <p className="mt-4 text-xs text-zinc-600">
                    The launcher must be installed for this link to open. The link above is
                    safe to share anywhere &mdash;{" "}
                    <span className="inline-flex items-center gap-1 align-middle">
                        <ExternalLink className="h-3 w-3" /> it just forwards into the app.
                    </span>
                </p>
            </div>
        </div>
    );
}
