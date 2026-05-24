"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { HERO_CONTENT } from "@/lib/config";

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);

    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    const [hoverFrame, setHoverFrame] = useState(1);
    const [clickFrame, setClickFrame] = useState(1);

    useEffect(() => {
        setLoaded(true);
        setVisible(true);
    }, []);

    useEffect(() => {
        if (!hovered || clicked) return;

        const interval = setInterval(() => {
            setHoverFrame((prev) =>
                prev >= HERO_CONTENT.button.frames ? 1 : prev + 1
            );
        }, HERO_CONTENT.button.animationSpeed);

        return () => clearInterval(interval);
    }, [hovered, clicked]);

    useEffect(() => {
        if (!clicked) return;

        const interval = setInterval(() => {
            setClickFrame((prev) =>
                prev >= HERO_CONTENT.button.frames ? 1 : prev + 1
            );
        }, HERO_CONTENT.button.animationSpeed);

        return () => clearInterval(interval);
    }, [clicked]);

    const buttonSrc = clicked
        ? HERO_CONTENT.button.clickedFrame(clickFrame)
        : HERO_CONTENT.button.defaultFrame(hoverFrame);

    return (
        <section className="relative h-[calc(100vh-2.5rem)] flex flex-col justify-center overflow-hidden">
            <video
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                autoPlay
                loop
                muted
                playsInline
            >
                <source
                    src={HERO_CONTENT.background.video}
                    type="video/mp4"
                />
            </video>

            <div className="absolute inset-0 bg-black/40 z-[1]" />

            <div className="absolute flex justify-center items-center bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/70 to-transparent z-[1]">
                <Link
                    target="_blank"
                    href={HERO_CONTENT.url}
                >
                    <div
                        className={`relative inline-block cursor-pointer transition-all duration-1000 ${
                            visible
                                ? "opacity-100 translate-y-0 delay-300"
                                : "opacity-0 translate-y-4"
                        }`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => {
                            setHovered(false);
                            setClicked(false);
                        }}
                        onMouseDown={() => {
                            setClickFrame(hoverFrame);
                            setClicked(true);
                        }}
                        onMouseUp={() => setClicked(false)}
                    >
                        <Image
                            src={buttonSrc}
                            alt={HERO_CONTENT.button.alt}
                            width={HERO_CONTENT.button.width}
                            height={HERO_CONTENT.button.height}
                            className="pixelated object-fill select-none"
                            draggable={false}
                            priority
                            unoptimized
                        />
                    </div>
                </Link>
            </div>

            <div className="container mx-auto mb-20 flex flex-col items-center gap-20 z-[2] relative">
                <Image
                    src={HERO_CONTENT.seasonLogo.src}
                    width={HERO_CONTENT.seasonLogo.width}
                    height={HERO_CONTENT.seasonLogo.height}
                    alt={HERO_CONTENT.seasonLogo.alt}
                    className={`w-auto pixelated h-40 object-contain transition-all duration-1000 ease-out ${
                        loaded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-90"
                    }`}
                />
            </div>
        </section>
    );
}