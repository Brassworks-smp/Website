"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import * as THREE from "three";
import Image from "next/image";
import * as React from "react";

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        setLoaded(true);
        setVisible(true);
    }, []);

    return (
        <section className="relative h-[calc(100vh-2.5rem)] flex flex-col justify-center overflow-hidden">
            <video
                className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/40 z-[1]" />

            <div className="absolute flex justify-center items-center bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/70 to-transparent z-[1]">
                <Link target="_blank" href="https://brassworks.opnsoc.org/discord">
                    <div
                        className={`relative inline-block cursor-pointer transition-all duration-1000 ${
                            visible ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-4"
                        }`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Image
                            src={hovered ? "/images/btn-hover.png" : "/images/btn.png"}
                            alt="Join Brassworks"
                            width={180}
                            height={80}
                            className="pixelated object-fill transition-opacity duration-300"
                            style={{ opacity: hovered ? 1 : 0.85 }}
                        />
                    </div>
                </Link>
            </div>

            <div
                ref={mountRef}
                className="absolute inset-0 z-0"
                style={{ pointerEvents: "none" }}
            />

            <div className="container mx-auto mb-20 flex flex-col items-center gap-20 z-[2] relative">
                <Image
                    src="/images/seasons/season2.png"
                    width={100}
                    height={100}
                    alt="brassworks-season2"
                    className={`w-auto pixelated h-40 object-contain transition-all duration-1000 ease-out ${
                        loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                />
            </div>
        </section>
    );
}