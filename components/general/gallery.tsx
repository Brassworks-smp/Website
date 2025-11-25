"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type GalleryItem = {
    src: string;
    alt?: string;
    author?: string;
};

export function GallerySlider({
                                  items,
                                  autoPlay = true,
                                  interval = 4500,
                                  className = "",
                              }: {
    items: GalleryItem[];
    autoPlay?: boolean;
    interval?: number;
    className?: string;
}) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [active, setActive] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const guardTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const interactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clamp = (i: number) => (i + items.length) % items.length;

    useEffect(() => {
        if (!autoPlay || isHovered || isInteracting || isAnimating || !trackRef.current) return;
        const id = setInterval(() => goTo(clamp(active + 1)), interval);
        return () => clearInterval(id);
    }, [active, autoPlay, interval, isHovered, isInteracting, isAnimating, items.length]);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () => {
            setIsInteracting(true);
            if (interactTimer.current) clearTimeout(interactTimer.current);
            interactTimer.current = setTimeout(() => setIsInteracting(false), 150);
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => goTo(active, false));
        ro.observe(el);
        return () => ro.disconnect();
    }, [active]);

    useEffect(() => {
        const root = trackRef.current;
        if (!root) return;
        const io = new IntersectionObserver(
            (entries) => {
                let best: { idx: number; ratio: number } | null = null;
                for (const e of entries) {
                    const idx = Number((e.target as HTMLElement).dataset.idx || "-1");
                    if (idx >= 0 && (best === null || e.intersectionRatio > best.ratio)) {
                        best = { idx, ratio: e.intersectionRatio };
                    }
                }
                if (best && best.idx !== active) setActive(best.idx);
            },
            { root, threshold: [0.25, 0.5, 0.65, 0.8, 0.95] }
        );
        slideRefs.current.forEach((n) => n && io.observe(n));
        return () => io.disconnect();
    }, [items.length, active]);

    const goTo = (i: number, smooth = true) => {
        if (isAnimating) return;
        const el = trackRef.current;
        if (!el) return;
        setIsAnimating(true);
        if (guardTimer.current) clearTimeout(guardTimer.current);
        guardTimer.current = setTimeout(() => setIsAnimating(false), 550);
        const w = el.clientWidth;
        el.scrollTo({ left: w * clamp(i), behavior: smooth ? "smooth" : "auto" });
    };

    const bgStripe = useMemo(
        () => (
            <div aria-hidden className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-zinc-950" />
                <div className="absolute inset-x-0 top-0 h-px bg-zinc-800" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-800" />
            </div>
        ),
        []
    );

    return (
        <section
            className={`relative w-full pt-6 pb-6 scroll-mt-32 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            id='gallery'
        >
            <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

            {bgStripe}
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden">
                    <div
                        ref={trackRef}
                        className="w-full min-h-[160px] md:min-h-[260px] overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scroll-smooth no-scrollbar"
                    >
                        {items.map((item, i) => (
                            <div
                                key={i}
                                ref={(n) => (slideRefs.current[i] = n)}
                                data-idx={i}
                                className="relative shrink-0 snap-center w-full flex items-center justify-center py-5"
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${items.length}`}
                            >
                                <div className="relative w-[86%] max-w-5xl aspect-[18/9] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
                                    <motion.img
                                        transition={{ duration: 0.3 }}
                                        src={item.src}
                                        alt={item.alt ?? `slide ${i + 1}`}
                                        className="w-full h-full object-cover select-none pointer-events-none"
                                        draggable={false}
                                    />
                                    {item.author && (
                                        <div className="absolute bottom-2.5 right-2.5">
                                            <div
                                                className="font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400 shadow-[0_3px_theme(colors.amber.700)] rounded-md"
                                                title={item.author}
                                            >
                                                {item.author}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-3.5 flex items-center gap-2">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => goTo(i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        goTo(i);
                                    }
                                }}
                                className={`h-3 w-3 rounded-full transition-all duration-300 border-2 border-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ${
                                    active === i
                                        ? "scale-125 bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.15)]"
                                        : "bg-zinc-700/40"
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                                tabIndex={0}
                            /> 
                        ))}
                    </div>
                </div>
            </div>

            <p className="sr-only">Use mouse, trackpad, or swipe to change slides. Pagination dots below.</p>
        </section>
    );
}
