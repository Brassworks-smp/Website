'use client';

import { useState } from "react";
import { Play } from "lucide-react";
import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
    Contraption: "bg-[#6d1717] border border-[#5c1414] ring-2 ring-inset ring-[#7a1c1c] shadow-[0_3px_0_theme(colors-[#5c1414])] flex items-center justify-center rounded-lg",
    Farm: "bg-[#6d1717] border border-[#5c1414] ring-2 ring-inset ring-[#7a1c1c] shadow-[0_3px_0_theme(colors-[#5c1414])] flex items-center justify-center rounded-lg",
    Aesthetic: "bg-[#6d1717] border border-[#5c1414] ring-2 ring-inset ring-[#7a1c1c] shadow-[0_3px_0_theme(colors-[#5c1414])] flex items-center justify-center rounded-lg",
    Beginner: "bg-[#6d1717] border border-[#5c1414] ring-2 ring-inset ring-[#7a1c1c] shadow-[0_3px_0_theme(colors-[#5c1414])] flex items-center justify-center rounded-lg",
    Advanced: "bg-[#6d1717] border border-[#5c1414] ring-2 ring-inset ring-[#7a1c1c] shadow-[0_3px_0_theme(colors-[#5c1414])] flex items-center justify-center rounded-lg",
};

const KEY_TAGS = ["Beginner", "Advanced", "Contraption", "Farm", "Aesthetic"];

const schematics = [
    {
        title: "Schematic1",
        author: "@Creator1",
        image: "/images/placeholder.png",
        tags: ["Beginner", "Aesthetic"],
        createVersion: "6.0.0",
        mcVersion: "1.21.1",
        videoUrl: "https://youtube.com/watch?v=example",
        materials: {
            iron: 100,
            wood: 50,
        },
        downloads: 1200,
        views: 5000,
        rating: 4.5,
        href: "/schematics/schematic1",
    },
    {
        title: "Schematic2",
        author: "@Creator2",
        image: "/images/placeholder.png",
        tags: ["Contraption", "Advanced"],
        createVersion: "0.5.1",
        mcVersion: "1.20.1",
        videoUrl: "https://youtube.com/watch?v=example2",
        materials: {
            cogwheel: 40,
        },
        downloads: 800,
        views: 3200,
        rating: 4.2,
        href: "/schematics/schematic2",
    },
];

export function SchematicSection() {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [selectedCreateVersion, setSelectedCreateVersion] = useState("all");
    const [selectedMcVersion, setSelectedMcVersion] = useState("all");

    const toggleTag = (tag: string) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // ✅ auto versions (kein hardcoding mehr)
    const CREATE_VERSIONS = [
        "all",
        ...Array.from(new Set(schematics.map(s => s.createVersion)))
    ];

    const MC_VERSIONS = [
        "all",
        ...Array.from(new Set(schematics.map(s => s.mcVersion)))
    ];

    const filteredSchematics = schematics.filter((s) =>
        (activeTags.length === 0 || activeTags.every((tag) => s.tags.includes(tag))) &&
        (selectedCreateVersion === "all" || s.createVersion === selectedCreateVersion) &&
        (selectedMcVersion === "all" || s.mcVersion === selectedMcVersion)
    );

    return (
        <section className="pb-12 pt-12 bg-background">
            <div className="container2">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">
                        Our Top Schematics
                    </h2>

                    {/* TAGS (UNVERÄNDERT) */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        {KEY_TAGS.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`
                                    font-minecraft px-3 py-1 rounded-md text-sm text-white
                                    transition
                                    ${TAG_COLORS[tag]}
                                    ${activeTags.includes(tag) ? "ring-4 ring-inset ring-white" : ""}
                                    hover:opacity-90
                                `}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* ✅ DROPDOWNS (neu, aber minimal eingefügt) */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        <select
                            value={selectedCreateVersion}
                            onChange={(e) => setSelectedCreateVersion(e.target.value)}
                            className="font-minecraft px-3 py-1 rounded-md text-sm text-white bg-zinc-800"
                        >
                            {CREATE_VERSIONS.map(v => (
                                <option key={v} value={v}>
                                    {v === "all" ? "All Create Versions" : `Create ${v}`}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedMcVersion}
                            onChange={(e) => setSelectedMcVersion(e.target.value)}
                            className="font-minecraft px-3 py-1 rounded-md text-sm text-white bg-zinc-800"
                        >
                            {MC_VERSIONS.map(v => (
                                <option key={v} value={v}>
                                    {v === "all" ? "All MC Versions" : v}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                    {filteredSchematics.map((schematic, index) => (
                        <div
                            key={index}
                            className="border border-neutral-700 rounded-lg transition-transform duration-300 flex flex-col h-[25rem] bg-zinc-900 shadow-lg"
                        >
                            <div className="relative p-3 w-full h-48 overflow-hidden rounded-t-lg schem-bg flex items-center border-b justify-center">
                                <img
                                    src={schematic.image}
                                    alt={schematic.title}
                                    className="object-contain w-full h-full"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-grow justify-between">
                                <div>
                                    <h3 className="font-semibold text-xl line-clamp-2 text-white">
                                        {schematic.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-minecraft">{schematic.author}</p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {schematic.tags.map((tag, i) => (
                                            <div
                                                key={i}
                                                className={`
                                                    font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white
                                                    ${TAG_COLORS[tag]}
                                                    rounded-md
                                                `}
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>

                                    {/* OPTIONAL: später nutzbar, aktuell hidden */}
                                    {/* {schematic.downloads} {schematic.views} {schematic.rating} */}
                                </div>

                                <div className="flex gap-2">
                                    <a
                                        href={schematic.href}
                                        className={`
                                        font-minecraft  cursor-pointer inline-flex items-center gap-2 px-4 py-2 h-10 text-sm text-white
                                        bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400
                                        shadow-[0_4px_theme(colors.amber.600)]
                                        hover:bg-amber-400 hover:shadow-[0_2px_theme(colors.amber.500)]
                                        hover:translate-y-0.5 transition mt-4 text-center
                                    `}
                                    >
                                        <p className="text-center">View Schematic</p>
                                    </a>

                                    {/* ✅ VIDEO BUTTON nutzt jetzt videoUrl */}
                                    <a
                                        href={schematic.videoUrl}
                                        target="_blank"
                                        className={`
                          font-minecraft inline-flex items-center gap-2 px-4 py-2 h-10 text-sm text-white
                          bg-green-600 border border-green-700 ring-2 ring-inset ring-green-400
                          shadow-[0_4px_theme(colors.green.700)]
                          hover:bg-green-500 hover:shadow-[0_2px_theme(colors.green.600)]
                          hover:translate-y-0.5 mt-4 transition
                        `}
                                    >
                                        <Play className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}