"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, X } from "lucide-react";

export function SeasonsSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const seasons = [
        {
            title: "Season 1",
            name: "The Beginning",
            description:
                "Our very first season! Featuring classic Create contraptions, community builds, and the foundation of what Brassworks is today.",
            imageUrl: "/images/seasons/season1.png",
            modpackOptions: [
                { name: "Modrinth", url: "https://modrinth.com/modpack/brassworks-smp-modpack/version/1.2.9" },
            ],
            mapUrl: "https://drive.proton.me/urls/MRCADETEG4#Z0Y7ezOqYnDi",
        },
        {
            title: "Season 2",
            name: "New World",
            description:
                "Season 2 lifts off with live map, brand-new mods, and a fresh world to explore. Bigger, brighter, bolder.",
            imageUrl: "/images/seasons/season2.png",
            modpackOptions: [
                { name: "Prism Launcher", url: "https://github.com/serverside-swzo/Brassworks-S2-Autoupdating/raw/refs/heads/master/Brassworks-S2-Autoupdating.zip" },
                {
                    name: "Modrinth",
                    url: "https://modrinth.com/modpack/brassworks-smp-modpack/version/2.0.0",
                },
            ],
            mapUrl: null,
        },
    ];

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => setOpenIndex(null), 250);
    };

    useEffect(() => {
        if (openIndex !== null) {
            setTimeout(() => setShowModal(true), 10);
        }
    }, [openIndex]);

    return (
        <section className="py-36 relative" id="seasons">
            <div className="container">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">
                        Seasons
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Explore the different eras of our Create SMP. Each season brings a
                        new world, new mods, and a fresh start for creative engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {seasons.map((season, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden flex flex-col"
                        >
                            <div className="relative mx-10 h-60 ">
                                <Image
                                    src={season.imageUrl}
                                    alt={season.title}
                                    fill
                                    className="object-contain rounded-t-xl"
                                />
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold font-minecraft mb-2 text-zinc-800 dark:text-white">
                                    {season.title} - {season.name}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                    {season.description}
                                </p>

                                <div className="mt-auto flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setOpenIndex(index)}
                                        className={`
                      font-minecraft inline-flex items-center gap-2 px-4 py-2 h-10 text-sm text-white
                      bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400
                      shadow-[0_4px_theme(colors.amber.600)]
                      hover:bg-amber-400 hover:shadow-[0_2px_theme(colors.amber.500)]
                      hover:translate-y-0.5 transition
                    `}
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Modpack
                                    </button>

                                    {season.mapUrl && (
                                        <Link href={season.mapUrl} target="_blank">
                                            <button
                                                className={`
                          font-minecraft inline-flex items-center gap-2 px-4 py-2 h-10 text-sm text-white
                          bg-green-600 border border-green-700 ring-2 ring-inset ring-green-400
                          shadow-[0_4px_theme(colors.green.700)]
                          hover:bg-green-500 hover:shadow-[0_2px_theme(colors.green.600)]
                          hover:translate-y-0.5 transition
                        `}
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Map
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL --- */}
            {openIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // prevent background close
                        className={`bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md p-6 relative mx-4 transform transition-all duration-300 ${
                            showModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold font-minecraft mb-4 text-zinc-800 dark:text-white">
                            Download Modpack - {seasons[openIndex].title}
                        </h3>

                        <ul className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-100">
                            {seasons[openIndex].modpackOptions.map((option, i) => (
                                <li key={i}>
                                    <Link
                                        href={option.url}
                                        target="_blank"
                                        className="flex items-center gap-3"
                                    >
                                        <span
                                            className={`w-5 h-5 rounded-sm shrink-0 ${
                                                option.name === "Prism Launcher"
                                                    ? "bg-purple-500"
                                                    : option.name === "Modrinth"
                                                        ? "bg-green-500"
                                                        : "bg-zinc-400"
                                            }`}
                                        />
                                        {option.name}
                                        <ExternalLink className="w-4 h-4 ml-auto opacity-60" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
}