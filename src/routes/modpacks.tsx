import { LockKeyhole } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { ButtonWipe } from "../components/general/ButtonWipe";
import { Footer } from "../components/general/Footer";
import { Header } from "../components/general/Header";
import { useHomepageAssets } from "../features/homepage-assets/use-homepage-assets";
import { createPageMetadata } from "../lib/seo";

const SERVER_URL = "https://modrinth.com/server/brassworks-smp-official-server";
const MODRINTH_URL = "https://modrinth.com/organization/brassworks";

export const Route = createFileRoute("/modpacks")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | Modpacks",
            description:
                "Explore Brassworks modpacks, current projects, and the experiences now in development.",
            path: "/modpacks",
        }),
    component: ModpacksRoute,
});

function ModpacksRoute() {
    const { data: assets } = useHomepageAssets();

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#171614] pt-[60px] text-white">
                <section className="px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-[60px]">
                    <div className="mx-auto max-w-[1600px]">
                        <header className="max-w-4xl">
                            <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                                Modpacks
                            </span>
                            <h1 className="mt-5 max-w-3xl font-minecraft text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                                Complete experiences, kept simple.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/64 sm:text-lg">
                                Brassworks modpacks combine carefully chosen
                                mods, shared worlds, and reliable updates in one
                                maintained project.
                            </p>
                        </header>
                    </div>
                </section>

                <section className="px-4 pb-20 sm:px-8 sm:pb-24 lg:px-[60px]">
                    <div className="mx-auto grid max-w-[1600px] gap-5 lg:grid-cols-2">
                        <article className="site-interactive group relative isolate min-h-[500px] overflow-hidden rounded-xl border-2 border-transparent bg-[#211f1b] transition-colors hover:border-[#d9b86e]">
                            {assets?.modpackCover ? (
                                <img
                                    src={assets.modpackCover}
                                    alt=""
                                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                                    decoding="async"
                                />
                            ) : null}
                            <div className="absolute inset-0 -z-10 bg-[#0d0c0b]/58" />
                            <div className="flex min-h-[500px] flex-col p-7 sm:p-9">
                                <span className="w-fit rounded-md bg-[#c7a35a] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#171614]">
                                    Play now
                                </span>
                                <div className="mt-auto">
                                    {assets?.modpackLogo ? (
                                        <img
                                            src={assets.modpackLogo}
                                            alt="Create: Brassworks"
                                            className="mb-7 h-auto w-[min(430px,88%)] object-contain object-left [image-rendering:pixelated]"
                                            decoding="async"
                                        />
                                    ) : (
                                        <h2 className="font-minecraft text-3xl font-bold sm:text-4xl">
                                            Create: Brassworks
                                        </h2>
                                    )}
                                    <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/75 sm:text-base">
                                        Build ambitious factories, explore a
                                        shared world, and shape an evolving
                                        Create experience together.
                                    </p>
                                    <a
                                        href={SERVER_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/button relative mt-7 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                                    >
                                        <ButtonWipe />
                                        <span className="relative z-10">
                                            View project
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </article>

                        <article className="site-interactive relative isolate min-h-[500px] overflow-hidden rounded-xl border-2 border-transparent bg-[#14202b] transition-colors hover:border-[#79c4ff]">
                            {assets?.modpack2Cover ? (
                                <img
                                    src={assets.modpack2Cover}
                                    alt=""
                                    className="absolute inset-0 -z-20 h-full w-full object-cover opacity-78"
                                    decoding="async"
                                />
                            ) : null}
                            <div className="absolute inset-0 -z-10 bg-[#0a1016]/65" />
                            <div className="flex min-h-[500px] flex-col p-7 sm:p-9">
                                <span className="w-fit rounded-md bg-[#2f78c4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                    In development
                                </span>
                                <div className="mt-auto">
                                    <LockKeyhole
                                        className="mb-7 h-11 w-11 text-[#eaf6ff]"
                                        strokeWidth={1.5}
                                    />
                                    <h2 className="font-minecraft text-3xl font-bold sm:text-4xl">
                                        Upcoming project
                                    </h2>
                                    <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/68 sm:text-base">
                                        Something new is taking shape behind
                                        closed doors. More will be shown when
                                        the project is ready.
                                    </p>
                                    <span className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-[#0a1016] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#eaf6ff]/68">
                                        More information soon
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>

                <section className="bg-[#0d0c0b] px-4 py-20 sm:px-8 sm:py-24 lg:px-[60px]">
                    <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
                        <div>
                            <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.15em] text-[#d9b86e]">
                                Brassworks Launcher
                            </span>
                            <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl">
                                Install, update, and play.
                            </h2>
                            <p className="mt-5 max-w-xl text-sm font-semibold leading-7 text-white/58 sm:text-base">
                                Each pack gets its own profile, files, and
                                updates without the usual manual setup.
                            </p>
                            <a
                                href="/launcher"
                                className="group/button relative mt-8 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                            >
                                <ButtonWipe />
                                <span className="relative z-10">
                                    Get the Launcher
                                </span>
                            </a>
                        </div>

                        <div className="divide-y divide-white/8 border-y border-white/8">
                            {[
                                "Separate profiles for every experience",
                                "Updates without rebuilding an installation",
                                "Release information in one clear place",
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-5 py-5"
                                >
                                    <span className="font-minecraft text-[10px] font-bold text-[#d9b86e]">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm font-semibold text-white/65">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="px-4 py-16 sm:px-8 sm:py-20 lg:px-[60px]">
                    <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-5 border-y border-white/8 py-8 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-minecraft text-xl font-bold">
                                Looking for individual mods?
                            </h2>
                            <p className="mt-2 text-sm font-semibold text-white/50">
                                Browse every public Brassworks project on
                                Modrinth.
                            </p>
                        </div>
                        <a
                            href={MODRINTH_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="site-interactive shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-[#d9b86e] transition-colors hover:text-[#dec17c]"
                        >
                            Browse all mods
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
