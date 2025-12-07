"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { Logo } from '@/components/logo';
import Image from "next/image";

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLoaded(true);

        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 0);
        camera.rotation.set(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            "/images/panorama/panorama_0.png?v=4",
            "/images/panorama/panorama_2.png?v=4",
            "/images/panorama/panorama_4.png?v=4",
            "/images/panorama/panorama_5.png?v=4",
            "/images/panorama/panorama_3.png?v=4",
            "/images/panorama/panorama_1.png?v=4",
        ]);
        scene.background = texture;

        let frameId: number;
        let elapsed = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            elapsed += 0.016; // ~60 FPS
            camera.rotation.y -= 0.00035;
            camera.rotation.x = Math.sin(elapsed * 0.04) * 0.02;
            renderer.render(scene, camera);
        };

        animate();

        // Resize-Handling
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            scene.clear();
            texture.dispose();
            renderer.dispose();
            THREE.Cache.clear();

            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <section className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden">
            <div
                ref={mountRef}
                className="absolute inset-0 z-0"
                style={{ pointerEvents: "none" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-[1]" />

            <div className="container mx-auto mt-16 flex flex-col items-center gap-20 z-[2] relative">
                <Image
                    src="/images/seasons/season2.png"
                    width={100}
                    height={100}
                    alt="brassworks-season2"
                    className={`w-auto h-40 object-contain transition-opacity duration-1000 ease-out ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                />

                <div
                    className={`
                        mt-2 transition-all duration-500 ease-in-out
                        ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                    `}
                >
                    <Link target="_blank" href="https://discord.gg/neqEBnPVgY">
                        <Button
                            variant="default"
                            className={`
                                font-minecraft inline-flex items-center justify-center gap-x-2
                                px-5 py-3 h-12 text-lg ring-2 ring-inset
                                border-amber-600 bg-amber-500 text-white
                                shadow-[0_4px_theme(colors.amber.600)]
                                ring-amber-400
                                hover:translate-y-0.5 hover:bg-amber-400
                                hover:shadow-[0_2px_theme(colors.amber.500)]
                                hover:ring-amber-300
                            `}
                        >
                            Join Brassworks Now
                        </Button>
                    </Link>
                </div>
                <div
                    className={`
                        transition-all duration-700 ease-in-out mt-[-4rem]
                        ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                    `}
                >
                    <Link target="_blank" href="https://ko-fi.com/brassworks">
                        <Button
                            variant="default"
                            className={`
                                font-minecraft inline-flex items-center justify-center w-[100%] gap-x-2
                                px-8 py-3 h-8 text-sm ring-2 ring-inset
                                border-violet-600 bg-violet-500 text-white
                                shadow-[0_4px_theme(colors.violet.600)]
                                ring-violet-400
                                hover:translate-y-0.5 hover:bg-violet-400
                                hover:shadow-[0_2px_theme(colors.violet.500)]
                                hover:ring-violet-300
                            `}
                        >
                            Support Us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}