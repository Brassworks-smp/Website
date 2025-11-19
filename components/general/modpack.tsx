"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, X } from "lucide-react";

export function ModpackSection() {
    const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const season = {
        title: "Season 2",
        name: "New World",
        description:
            "Brassworks Season 2 lifts off with live map, brand-new mods, and a fresh world to explore. Bigger, brighter, bolder.",
        imageUrl: "/images/gallery/1.png?v=2",
        modpackOptions: [
            { name: "Prism Launcher", url: "https://github.com/serverside-swzo/Brassworks-S2-Autoupdating" },
            {
                name: "Modrinth",
                url: "https://modrinth.com/modpack/brassworks-smp-modpack",
            },
        ],
    };

    const openModal = () => {
        setShowModal(true);
        setTimeout(() => setModalVisible(true), 10);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => setShowModal(false), 250);
    };

    return (
        <section className="pb-4 pt-36 px-6 bg-background text-zinc-100" id='modpack'>
            <div className="container max-w-7xl mx-auto text-center">
                <div className="max-w-4xl mx-auto mb-16">
                    <h1 className="font-minecraft uppercase text-3xl md:text-4xl font-bold mb-2">
                        Modpack - Season 2
                    </h1>
                    <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
                        Brassworks Season 2 lifts off with live map, brand-new mods, and a fresh world to explore. Bigger, brighter, bolder.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-5xl mx-auto">
                    <Image
                        src={season.imageUrl}
                        alt={`${season.name} Modpack`}
                        width={700}
                        height={600}
                        className="object-cover rounded-xl shadow-lg mt-12"
                        priority
                    />

                    <div>
                        <h2 className="font-minecraft text-3xl font-bold mb-6 text-center md:text-left">
                            How to Install
                        </h2>

                        <ol className="text-left list-decimal list-inside space-y-5 text-sm md:text-base text-zinc-300 leading-relaxed">
                            <li>
                                <strong className="text-zinc-100">Using Prism Launcher</strong>:<br />
                                Download Prism Launcher from{" "}
                                <Link
                                    href="https://prismlauncher.org/"
                                    target="_blank"
                                    className="text-amber-400 underline hover:text-amber-300"
                                    rel="noopener noreferrer"
                                >
                                    here
                                </Link>
                                , then add the Brassworks Season 2 modpack via the{" "}
                                <Link 
                                    href="https://github.com/serverside-swzo/Brassworks-S2-Autoupdating"
                                    target="_blank"
                                    className="text-amber-400 underline hover:text-amber-300"
                                    rel="noopener noreferrer"
                                > 
                                    Auto-Updater ZIP
                                </Link> inside the launcher.
                            </li>
                            <li>
                                <strong className="text-zinc-100">Using Modrinth</strong>:<br />
                                Visit the{" "}
                                <Link
                                    href="https://modrinth.com/modpack/brassworks-smp-modpack"
                                    target="_blank"
                                    className="text-amber-400 underline hover:text-amber-300"
                                    rel="noopener noreferrer"
                                >
                                    Modrinth page
                                </Link>
                                , then download and install the pack manually or use a compatible launcher.
                            </li>
                            <li>
                                <strong className="text-zinc-100">Launch and Enjoy!</strong><br />
                                Start the modpack in your launcher and dive into the Brassworks world. We can’t wait to see your creations!
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="mt-16 flex justify-center">
                    <button
                        onClick={openModal}
                        className="
              font-minecraft inline-flex items-center gap-2 px-4 py-2 h-10 text-sm text-white
              bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400
              shadow-[0_4px_theme(colors.amber.600)]
              hover:bg-amber-400 hover:shadow-[0_2px_theme(colors.amber.500)]
              hover:translate-y-0.5 transition
            "
                    >
                        <Download className="w-4 h-4" />
                        Download Modpack
                    </button>
                </div>
            </div>

            {/* --- MODAL --- */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md p-6 relative mx-4 transform transition-all duration-300 ${
                            modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
                            Download Modpack – {season.title}
                        </h3>

                        <ul className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-100">
                            {season.modpackOptions.map((option, i) => (
                                <li key={i}>
                                    <Link
                                        href={option.url}
                                        target="_blank"
                                        className="flex items-center gap-3"
                                        rel="noopener noreferrer"
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