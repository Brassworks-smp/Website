"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import * as React from "react";

export function SectionBar() {
    const [hovered, setHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        if (hovered) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [hovered]);

    return (
        <section
            className="relative h-40 w-full overflow-hidden flex items-center justify-center border-b-2 border-b-gray-200/10"
        >
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    hovered ? "blur-sm scale-105" : "blur-md scale-110"
                }`}
                muted
                loop
                playsInline
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/50 transition-opacity duration-700" />
            <a href="/schematics/brassworks">
                <Image
                    src="/images/seasons/season2.png"
                    width={330}
                    height={330}
                    alt="brassworks-season2"
                    className={`relative z-10 pixelated object-contain transition-all duration-500 cursor-pointer ${
                        hovered ? "scale-105 opacity-100" : "scale-95 opacity-90"
                    }`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />
            </a>
        </section>
    );
}