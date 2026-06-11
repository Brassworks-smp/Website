"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export type LauncherShot = { src: string; alt: string };

export function LauncherGallery({ shots }: { shots: LauncherShot[] }) {
    const [active, setActive] = useState<number | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shots.map((shot, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        aria-label={`Open screenshot: ${shot.alt}`}
                    >
                        <img
                            src={shot.src}
                            alt={shot.alt}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            draggable={false}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                            <span className="font-minecraft text-[11px] tracking-wide text-zinc-100">
                                {shot.alt}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {active !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setActive(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        onClick={() => setActive(null)}
                        className="absolute right-4 top-4 text-zinc-300 transition hover:text-white"
                        aria-label="Close preview"
                    >
                        <X className="h-7 w-7" />
                    </button>
                    <img
                        src={shots[active].src}
                        alt={shots[active].alt}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[88vh] max-w-6xl rounded-lg border border-zinc-700 object-contain shadow-2xl"
                        draggable={false}
                    />
                </div>
            )}
        </>
    );
}