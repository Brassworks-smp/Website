import { useHomepageAssets } from "../../features/homepage-assets/use-homepage-assets";
import { useMobileLayout } from "../../lib/use-mobile-layout";
import { ButtonWipe } from "./ButtonWipe";

type FeaturedMod = {
    id: string;
    name: string;
    href: string;
    icon: string;
};

const ORGANIZATION_URL = "https://modrinth.com/organization/brassworks";

const FEATURED_MODS: FeaturedMod[] = [
    {
        id: "tradeworks",
        name: "Create: Tradeworks",
        href: "https://modrinth.com/mod/tradeworks",
        icon: "https://cdn.modrinth.com/data/gnOpd0sq/4f3a6fe922cd2a7f8dc0b4efbf39c09ef8141b43_96.webp",
    },
    {
        id: "missions",
        name: "Create: Brassworks Missions",
        href: "https://modrinth.com/mod/create-brassworks-missions",
        icon: "https://cdn.modrinth.com/data/uUhZpyjI/8762b39e48f9b6233e1defd1348ba9ab7ad38131_96.webp",
    },
    {
        id: "repackaged",
        name: "Create: Repackaged",
        href: "https://modrinth.com/mod/repackaged",
        icon: "https://cdn.modrinth.com/data/D6daOdv9/b73a4655441a5e038166a80df266bb4415ddc32d_96.webp",
    },
    {
        id: "blueprinted",
        name: "Create: Blueprinted",
        href: "https://modrinth.com/mod/create-blueprinted",
        icon: "https://cdn.modrinth.com/data/nJM6buSc/6b405d31775693b412d6f6f7d0480efecab956a5_96.webp",
    },
    {
        id: "tank-fix",
        name: "Create: Stuff 'N Additions - Tank Fix",
        href: "https://modrinth.com/mod/create-stuff-and-addition-tank-fix",
        icon: "https://cdn.modrinth.com/data/LANuxfjR/feda5fa2a67b08b0052fef77785740fde4dfb7d9_96.webp",
    },
];

export function ModsSection() {
    const { data: homepageAssets } = useHomepageAssets();
    const mobile = useMobileLayout();
    const featuredMods = FEATURED_MODS;

    if (!homepageAssets?.modsCover || mobile) return null;

    return (
        <section
            id="mods"
            className="bg-[#171614] px-4 pb-14 text-white sm:px-8 sm:pb-16 lg:px-[60px] lg:pb-20"
        >
            <style>{`
        @keyframes brassworks-mod-carousel {
          from { transform: translateX(calc(-50% - var(--carousel-gap-half))); }
          to { transform: translateX(0); }
        }
      `}</style>

            <div className="mx-auto max-w-[1600px]">
                <div className="group/banner relative isolate grid min-h-[250px] cursor-pointer overflow-hidden rounded-xl border-2 border-transparent bg-[#211f1b] transition-colors duration-500 ease-out hover:border-[#d9b86e] focus-within:border-[#d9b86e] md:grid-cols-[minmax(0,1fr)_auto]">
                    <img
                        src={homepageAssets.modsCover}
                        alt=""
                        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
                        style={{
                            WebkitMaskImage:
                                "linear-gradient(90deg, #000 0%, #000 48%, rgba(0,0,0,.72) 62%, rgba(0,0,0,.35) 82%, transparent 100%)",
                            maskImage:
                                "linear-gradient(90deg, #000 0%, #000 48%, rgba(0,0,0,.72) 62%, rgba(0,0,0,.35) 82%, transparent 100%)",
                        }}
                        draggable="false"
                        decoding="async"
                        aria-hidden="true"
                    />

                    <a
                        href={ORGANIZATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-[5] outline-none"
                        aria-label="Explore all Brassworks mods on Modrinth"
                    />

                    <div className="pointer-events-none relative z-10 flex max-w-2xl flex-col justify-center px-7 py-10 sm:px-10 lg:px-12">
                        <h2 className="font-minecraft text-3xl font-bold leading-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.95)] sm:text-4xl">
                            Our Mods
                        </h2>
                        <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-white/75 [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] sm:text-base">
                            We build mods of every kind - from small
                            quality-of-life ideas to entirely new systems.
                        </p>

                        <a
                            href={ORGANIZATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/button pointer-events-auto relative z-20 mt-6 inline-flex min-h-11 w-fit items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614] [text-shadow:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dec17c]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">
                                Explore All Mods
                            </span>
                        </a>
                    </div>

                    <div className="pointer-events-none relative z-10 flex items-center justify-center px-7 pb-9 sm:px-10 md:justify-end md:py-8 md:pl-4 lg:pr-14">
                        <div
                            className="w-[232px] overflow-hidden py-5 [--carousel-gap-half:0.5rem] [--carousel-gap:1rem] sm:w-[360px] sm:[--carousel-gap-half:0.75rem] sm:[--carousel-gap:1.5rem] md:w-[390px] lg:w-[500px] lg:[--carousel-gap-half:1rem] lg:[--carousel-gap:2rem] xl:w-[600px] 2xl:w-[680px]"
                            style={{
                                WebkitMaskImage:
                                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.18) 8%, rgba(0,0,0,.55) 20%, #000 34%, #000 66%, rgba(0,0,0,.55) 80%, rgba(0,0,0,.18) 92%, transparent 100%)",
                                maskImage:
                                    "linear-gradient(to right, transparent 0%, rgba(0,0,0,.18) 8%, rgba(0,0,0,.55) 20%, #000 34%, #000 66%, rgba(0,0,0,.55) 80%, rgba(0,0,0,.18) 92%, transparent 100%)",
                            }}
                        >
                            <div className="flex w-max items-center gap-[var(--carousel-gap)] [animation:brassworks-mod-carousel_18s_linear_infinite] [animation-play-state:paused] group-hover/banner:[animation-play-state:running] motion-reduce:[animation-play-state:paused]">
                                {[true, false].map((isClone, copyIndex) => (
                                    <div
                                        key={copyIndex}
                                        className="flex shrink-0 items-center gap-[var(--carousel-gap)]"
                                        aria-hidden={isClone || undefined}
                                    >
                                        {featuredMods.map((mod) => (
                                            <a
                                                key={`${copyIndex}-${mod.id}`}
                                                href={mod.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                tabIndex={
                                                    isClone ? -1 : undefined
                                                }
                                                className="group/mod pointer-events-auto relative z-20 flex h-[108px] w-[108px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#171614]/30 outline-none sm:h-[128px] sm:w-[128px] md:h-[138px] md:w-[138px] lg:h-[150px] lg:w-[150px]"
                                                aria-label={`Open ${mod.name} on Modrinth`}
                                            >
                                                <img
                                                    src={mod.icon}
                                                    alt={
                                                        isClone ? "" : mod.name
                                                    }
                                                    className="h-[86%] w-[86%] select-none object-contain opacity-85 transition-opacity duration-700 ease-out group-hover/mod:opacity-100"
                                                    draggable="false"
                                                    decoding="async"
                                                    loading="lazy"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
