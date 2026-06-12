import React from "react";
import { Boxes, Layers, Coffee, Package, Palette, Settings2, DownloadCloud } from "lucide-react";

const ARCHITECTURE: { icon: React.ReactNode; title: string; body: React.ReactNode }[] = [
    {
        icon: <Boxes className="h-5 w-5" />,
        title: "Built on portablemc",
        body: (
            <>
                Version resolving and launching are powered by a heavily modified{" "}
                <a
                    href="https://github.com/theorzr/portablemc"
                    className="text-amber-400 hover:text-amber-300"
                    target="_blank"
                    rel="noreferrer"
                >
                    portablemc
                </a>{" "}
                core.
            </>
        ),
    },
    {
        icon: <Package className="h-5 w-5" />,
        title: "Rust packwiz + unsup",
        body: (
            <>
                A from-scratch rewrite of the{" "}
                <a
                    href="https://github.com/packwiz/packwiz"
                    className="text-amber-400 hover:text-amber-300"
                    target="_blank"
                    rel="noreferrer"
                >
                    packwiz
                </a>{" "}
                installer in Rust, with the{" "}
                <a
                    href="https://github.com/unascribed/unsup"
                    className="text-amber-400 hover:text-amber-300"
                    target="_blank"
                    rel="noreferrer"
                >
                    unsup
                </a>{" "}
                update specification on top for resumable, hash-verified pack updates.
            </>
        ),
    },
    {
        icon: <Layers className="h-5 w-5" />,
        title: "Native Rust core",
        body: (
            <>
                A Cargo workspace of focused Rust crates behind a Tauri shell, so the heavy
                lifting stays native while the UI stays a thin React layer.
            </>
        ),
    },
    {
        icon: <Coffee className="h-5 w-5" />,
        title: "Zero-setup Java & mods",
        body: (
            <>
                Java runtimes are provisioned automatically from Adoptium, and mod content
                resolves against both Modrinth and CurseForge.
            </>
        ),
    },
];

export function LauncherArchitecture() {
    return (
        <div className="mt-24">
            <div className="mb-10 text-center">
                <h2 className="font-minecraft uppercase text-2xl md:text-3xl font-bold">
                    Under the hood
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-zinc-400">
                    Fast and reliable by building on great open-source projects, then
                    rewriting the parts that matter in Rust.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {ARCHITECTURE.map((item) => (
                    <div
                        key={item.title}
                        className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-amber-500/40"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-minecraft text-sm uppercase tracking-wide text-zinc-100">
                                {item.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                                {item.body}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const FEATURES: { src: string; alt: string; title: string; body: string }[] = [
    {
        src: "/images/launcher/PlayScreen.png",
        alt: "Play screen",
        title: "One click to play",
        body: "The Play screen pulls together everything for the active instance — launch state, playtime, pack version, and the latest news from the server — so you are one button away from jumping in.",
    },
    {
        src: "/images/launcher/Instances.png",
        alt: "Instances",
        title: "Instances and folders",
        body: "Run as many instances as you like, side by side. Featured modpacks sit up top, while your own NeoForge, Forge, Fabric, and Vanilla setups stay tidy in collapsible folders.",
    },
    {
        src: "/images/launcher/Content.png",
        alt: "Content browser",
        title: "Browse and manage content",
        body: "Search, install, and toggle mods, resource packs, shaders, and datapacks from one place. Filter by loader and source, and keep everything for an instance organised in a single view.",
    },
    {
        src: "/images/launcher/SkinSelector.png",
        alt: "Skin selector",
        title: "Skins and capes",
        body: "Build skin presets as full loadouts — each with its own cape — then preview them on a live 3D model and apply with a single click.",
    },
    {
        src: "/images/launcher/Worlds.png",
        alt: "Worlds",
        title: "Worlds and backups",
        body: "See every world for an instance at a glance, with gamemode, seed, size, and last-played details. Take backups, manage datapacks, and jump straight into a save.",
    },
    {
        src: "/images/launcher/Servers.png",
        alt: "Servers",
        title: "Servers at a glance",
        body: "Star your favourites and keep an eye on live player counts and ping. The Brassworks SMP is featured front and centre, with room for any other server you play on.",
    },
];

export function LauncherFeatures() {
    return (
        <div className="mt-24">
            <div className="mb-12 text-center">
                <h2 className="font-minecraft uppercase text-2xl md:text-3xl font-bold">
                    Everything in one place
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-zinc-400">
                    A look inside the launcher.
                </p>
            </div>

            <div className="space-y-12 lg:space-y-20">
                {FEATURES.map((f, i) => {
                    const imageLeft = i % 2 === 0;
                    return (
                        <div
                            key={f.title}
                            className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12"
                        >
                            <div
                                className={`overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg ${
                                    imageLeft ? "lg:order-1" : "lg:order-2"
                                }`}
                            >
                                <img
                                    src={f.src}
                                    alt={f.alt}
                                    loading="lazy"
                                    draggable={false}
                                    className="w-full"
                                />
                            </div>
                            <div className={imageLeft ? "lg:order-2" : "lg:order-1"}>
                                <h3 className="font-minecraft text-xl font-bold text-zinc-100 md:text-2xl">
                                    {f.title}
                                </h3>
                                <p className="mt-3 leading-relaxed text-zinc-400">{f.body}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const THEMES = [
    { src: "/images/launcher/OledTheme.png", label: "OLED" },
    { src: "/images/launcher/MochaTheme.png", label: "Mocha" },
    { src: "/images/launcher/OceanTheme.png", label: "Ocean" },
];

const EXTRAS = [
    {
        src: "/images/launcher/SettingsCustomizable.png",
        icon: <Settings2 className="h-4 w-4" />,
        label: "Customisable settings and accent colours",
    },
    {
        src: "/images/launcher/Import.png",
        icon: <DownloadCloud className="h-4 w-4" />,
        label: "Import from Prism Launcher and Modrinth",
    },
];

export function LauncherThemes() {
    return (
        <div className="mt-24">
            <div className="mb-10 text-center">
                <h2 className="font-minecraft uppercase text-2xl md:text-3xl font-bold">
                    <span className="inline-flex items-center gap-2">
                        <Palette className="h-6 w-6 text-amber-400" />
                        Make it yours
                    </span>
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-zinc-400">
                    A handful of built-in themes and a customisable accent colour let you set
                    the mood. Pick a look that matches how you play.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {THEMES.map((t) => (
                    <figure
                        key={t.label}
                        className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg"
                    >
                        <img
                            src={t.src}
                            alt={`${t.label} theme`}
                            loading="lazy"
                            draggable={false}
                            className="w-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <span className="font-minecraft text-xs uppercase tracking-widest text-zinc-100">
                                {t.label}
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {EXTRAS.map((e) => (
                    <figure
                        key={e.label}
                        className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg"
                    >
                        <img
                            src={e.src}
                            alt={e.label}
                            loading="lazy"
                            draggable={false}
                            className="w-full"
                        />
                        <figcaption className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-900/60 px-4 py-3 text-amber-400">
                            {e.icon}
                            <span className="text-sm text-zinc-300">{e.label}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    );
}
