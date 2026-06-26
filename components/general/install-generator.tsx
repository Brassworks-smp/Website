"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Link2, Copy, Check, AlertTriangle, Wand2 } from "lucide-react";

const SCHEME = "brassworks://install";
const INSTALL_PATH = "/install";

type Parsed =
    | { ok: true; query: string; name: string; sharedBy?: string }
    | { ok: false; error: string }
    | { ok: null };

function parseInput(raw: string): Parsed {
    const value = raw.trim();
    if (!value) return { ok: null };

    let query: URLSearchParams;

    try {
        if (value.startsWith(SCHEME)) {
            // brassworks://install?... — split on the first '?'
            const q = value.slice(value.indexOf("?") + 1);
            query = new URLSearchParams(value.includes("?") ? q : "");
        } else if (/^https?:\/\//i.test(value)) {
            const u = new URL(value);
            query = u.searchParams;
        } else if (value.startsWith("?") || value.includes("=")) {
            // bare query string
            query = new URLSearchParams(value.replace(/^\?/, ""));
        } else {
            return {
                ok: false,
                error: "Paste a brassworks://install?… link (or an existing share link).",
            };
        }
    } catch {
        return { ok: false, error: "That doesn't look like a valid URL." };
    }

    if (!query.get("pack_url")) {
        return {
            ok: false,
            error: "The link is missing a pack_url parameter.",
        };
    }

    return {
        ok: true,
        query: query.toString(),
        name: query.get("name") || "Untitled modpack",
        sharedBy: query.get("shared_by") || undefined,
    };
}

export function InstallGenerator() {
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    const origin =
        typeof window !== "undefined"
            ? window.location.origin
            : "https://brassworks.opnsoc.org";

    const parsed = useMemo(() => parseInput(input), [input]);

    const shareUrl =
        parsed.ok === true ? `${origin}${INSTALL_PATH}?${parsed.query}` : "";

    async function copy() {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
                    <Link2 className="h-6 w-6" />
                </div>
                <h1 className="font-minecraft text-2xl font-bold text-zinc-100">
                    Share an install link
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
                    {SCHEME} links aren&apos;t clickable on Discord and most chat apps.
                    Paste one below to turn it into a normal, clickable https link that
                    forwards straight into the Brassworks Launcher.
                </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <label
                    htmlFor="deeplink"
                    className="font-minecraft text-xs uppercase tracking-widest text-amber-400"
                >
                    Launcher link
                </label>
                <textarea
                    id="deeplink"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={4}
                    spellCheck={false}
                    placeholder="brassworks://install?pack_url=…&name=…"
                    className="mt-2 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-amber-500/60"
                />

                {parsed.ok === false && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-red-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        {parsed.error}
                    </p>
                )}

                {parsed.ok === true && (
                    <div className="mt-5 space-y-3">
                        <p className="font-minecraft text-xs uppercase tracking-widest text-zinc-500">
                            Shareable link · {parsed.name}
                            {parsed.sharedBy ? ` · shared by ${parsed.sharedBy}` : ""}
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                readOnly
                                value={shareUrl}
                                onFocus={(e) => e.currentTarget.select()}
                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 font-mono text-xs text-amber-300 outline-none"
                            />
                            <button
                                onClick={copy}
                                className="font-minecraft inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-amber-600 bg-amber-500/90 px-4 py-2.5 text-sm text-white transition hover:bg-amber-400"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <Link
                            href={`${INSTALL_PATH}?${parsed.query}`}
                            className="inline-flex items-center gap-1.5 text-xs text-amber-400 underline hover:text-amber-300"
                        >
                            <Wand2 className="h-3.5 w-3.5" />
                            Preview the install page
                        </Link>
                    </div>
                )}
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <h2 className="font-minecraft text-sm uppercase tracking-widest text-amber-400">
                    How it works
                </h2>
                <ol className="mt-3 space-y-2.5 text-sm text-zinc-300">
                    {[
                        <>
                            In the Brassworks Launcher, copy a pack&apos;s{" "}
                            <strong>share link</strong> (the {SCHEME} URL).
                        </>,
                        <>Paste it above to get a clickable https link.</>,
                        <>
                            Share that link anywhere. When someone opens it, they get a
                            friendly page that launches the pack in their launcher.
                        </>,
                    ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="font-minecraft mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-500/15 text-[11px] text-amber-400">
                                {i + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
