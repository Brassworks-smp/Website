"use client";

import { useState, useEffect } from "react";
import { HandCoins, Wrench, ServerCog } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: HandCoins,
        title: "Person1",
        bgImage: "/images/panorama/1.png",
        href: "/schematics/person1",
    },
    {
        icon: Wrench,
        title: "Person2",
        bgImage: "/images/person2-bg.jpg",
        href: "/schematics/person2",
    },
    {
        icon: ServerCog,
        title: "Person3",
        bgImage: "/images/person3-bg.jpg",
        href: "/schematics/person3",
    },
];

export function PartnerSection() {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = parseInt(entry.target.getAttribute("data-idx") || "0");
                        setVisibleItems((prev) => [...prev, idx]);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll(".feature-item").forEach((item) => {
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="pb-4 pt-12" id="our-server">
            <div className="container2">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">
                        Our Partnered Schematic Creators
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <a
                            key={idx}
                            href={feature.href}
                            data-idx={idx}
                            className={cn(
                                "feature-item relative overflow-hidden p-6 border border-neutral-700 rounded-lg transition-all duration-500 transform",
                                visibleItems.includes(idx)
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10",
                                "hover:-translate-y-1",
                                "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-black before:via-black/80 before:to-transparent before:z-0",
                                "bg-cover bg-right"
                            )}
                            style={{
                                backgroundImage: `url(${feature.bgImage})`,
                                transitionDelay: `${idx * 100}ms`,
                            }}
                        >
                            <div className="relative z-10">
                                <div className="h-11 w-12 text-white bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400 shadow-[0_3px_theme(colors.amber.700)] flex items-center justify-center rounded-lg mb-5">
                                    <feature.icon className="h-6 w-6 text-neutral-100" />
                                </div>
                                <h3 className="font-bold font-minecraft text-xl mb-3 text-white">
                                    {feature.title}
                                </h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}