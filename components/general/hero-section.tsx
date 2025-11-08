"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

export function HeroSection() {
    const [loaded, setLoaded] = useState(false);
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLoaded(true);

        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const loader = new THREE.CubeTextureLoader();
        scene.background = loader.load([
            "/panorama/0.png?v=1",
            "/panorama/2.png?v=1",
            "/panorama/4.png?v=1",
            "/panorama/5.png?v=1",
            "/panorama/3.png?v=1",
            "/panorama/1.png?v=1",
        ]);

        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            camera.rotation.y -= 0.00035;
            camera.rotation.x = Math.sin(Date.now() * 0.0001) * 0.02;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", handleResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
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
                <img
                    src="/seasons/season2.png"
                    className={`w-auto h-40 object-contain transition-opacity duration-1000 ease-out ${
                        loaded ? "opacity-100" : "opacity-0"
                    }`}
                    alt="Brassworks Logo"
                />

                <Link target="_blank" href="https://discord.gg/neqEBnPVgY">
                    <div
                        className={`
              mt-10 transition-all duration-700 ease-in-out
              ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
                    >
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
                    </div>
                </Link>
            </div>
        </section>
    );
}