import {
    ChevronDown,
    Download,
    Ellipsis,
    House,
    LockKeyhole,
    type LucideIcon,
    Newspaper,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useHomepageAssets } from "../../features/homepage-assets/use-homepage-assets";
import { assetUrl } from "../../lib/assets.js";
import { ButtonWipe } from "./ButtonWipe";
import { SiteAnnouncement } from "./SiteAnnouncement";

const DISCORD_URL = "https://discord.gg/brassworks";
const GITHUB_URL = "https://github.com/Brassworks-smp";
const MODRINTH_URL = "https://modrinth.com/organization/brassworks";
const OBSIDIAN_SERVERS_URL =
    "https://obsidianservers.com/partner/brassworks-smp";
const SNOWGO_URL = "https://www.youtube.com/@snowy-go";
const YOUTUBE_URL = "https://www.youtube.com/@BrassworksSMP";
const SERVER_URL = "https://modrinth.com/server/brassworks-smp-official-server";

type ModpackMenuItem = {
    id: string;
    title: string;
    description: string;
    tag: string;
    cover: string;
    logo: string | null;
    href: string;
    blue: boolean;
};

type CommunityMenuItem = {
    label: string;
    description: string;
    href: string;
};

type MobileTab = {
    label: string;
    href: string;
    icon: LucideIcon;
    isActive: (pathname: string) => boolean;
};

const mobileTabs: MobileTab[] = [
    {
        label: "Home",
        href: "/",
        icon: House,
        isActive: (pathname) => pathname === "/",
    },
    {
        label: "News",
        href: "/news",
        icon: Newspaper,
        isActive: (pathname) => pathname.startsWith("/news"),
    },
    {
        label: "Launcher",
        href: "/launcher",
        icon: Download,
        isActive: (pathname) => pathname.startsWith("/launcher"),
    },
];

const mobileExploreLinks: CommunityMenuItem[] = [
    {
        label: "Roadmap",
        description: "See what we are working on next.",
        href: "/roadmap",
    },
    {
        label: "Finances",
        description: "Where our income comes from and where it goes.",
        href: "/finances",
    },
];

const navigation = [
    { label: "Finances", href: "/finances" },
    { label: "News", href: "/news" },
];

const communityLinks: CommunityMenuItem[] = [
    {
        label: "Discord",
        description: "Chat with the community, get support, and join us.",
        href: DISCORD_URL,
    },
    {
        label: "GitHub",
        description: "Explore our open-source projects and development.",
        href: GITHUB_URL,
    },
    {
        label: "Modrinth",
        description: "Browse every released Brassworks project.",
        href: MODRINTH_URL,
    },
    {
        label: "YouTube",
        description: "Watch builds, updates, and community videos.",
        href: YOUTUBE_URL,
    },
];

const partnerLinks: CommunityMenuItem[] = [
    {
        label: "SnowGo",
        description: "Our director, engineer, and creative partner.",
        href: SNOWGO_URL,
    },
    {
        label: "Obsidian Servers",
        description: "Hosting partner powering Brassworks projects.",
        href: OBSIDIAN_SERVERS_URL,
    },
];

function externalLinkProps(href: string) {
    return href.startsWith("http")
        ? { target: "_blank" as const, rel: "noopener noreferrer" }
        : {};
}

function NavTrigger({ children, open }: { children: string; open: boolean }) {
    return (
        <span
            className={`site-accent-hover inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-300 hover:bg-white/5 hover:text-[#d9b86e] xl:px-4 ${
                open ? "bg-white/5 text-[#d9b86e]" : "text-white/65"
            }`}
        >
            {children}
            <ChevronDown
                size={14}
                strokeWidth={2.2}
                className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "rotate-180" : ""
                }`}
            />
        </span>
    );
}

function ModpackPreview({
    item,
    onNavigate,
}: {
    item: ModpackMenuItem;
    onNavigate?: () => void;
}) {
    return (
        <a
            href={item.href}
            {...externalLinkProps(item.href)}
            onClick={onNavigate}
            className={`group/card relative isolate min-h-[154px] overflow-hidden rounded-lg border-2 border-transparent bg-[#211f1b] transition-[border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                item.blue
                    ? "hover:border-[#79c4ff] focus-visible:border-[#79c4ff]"
                    : "hover:border-[#d9b86e] focus-visible:border-[#d9b86e]"
            }`}
        >
            <img
                src={item.cover}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                draggable="false"
                decoding="async"
            />
            <span className="absolute inset-0 -z-10 bg-black/55 transition-colors duration-500 group-hover/card:bg-black/42" />
            <span
                className={`absolute left-3 top-3 rounded-md px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                    item.blue
                        ? "bg-[#2f78c4] text-white"
                        : "bg-[#c7a35a] text-[#171614]"
                }`}
            >
                {item.tag}
            </span>
            <div className="absolute inset-x-4 bottom-4">
                {item.logo ? (
                    <img
                        src={item.logo}
                        alt={item.title}
                        className="mb-2 h-10 w-auto max-w-[85%] object-contain object-left [image-rendering:pixelated]"
                        draggable="false"
                        decoding="async"
                    />
                ) : (
                    <div className="mb-2 flex items-center gap-2">
                        <LockKeyhole
                            className="h-5 w-5 text-[#eaf6ff]"
                            strokeWidth={1.6}
                        />
                        <span className="font-minecraft text-sm font-bold text-white">
                            {item.title}
                        </span>
                    </div>
                )}
                <p className="max-w-[280px] text-[11px] font-semibold leading-4 text-white/76">
                    {item.description}
                </p>
            </div>
        </a>
    );
}

function CommunityLink({
    item,
    onNavigate,
}: {
    item: CommunityMenuItem;
    onNavigate?: () => void;
}) {
    return (
        <a
            href={item.href}
            {...externalLinkProps(item.href)}
            onClick={onNavigate}
            className="group/link site-accent-hover block rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-white/5"
        >
            <span className="block font-minecraft text-[11px] font-bold text-white transition-colors duration-300 group-hover/link:text-[#d9b86e]">
                {item.label}
            </span>
            <span className="mt-1 block text-[11px] font-medium leading-4 text-white/45">
                {item.description}
            </span>
        </a>
    );
}

function DesktopModpacksMenu({
    items,
    open,
    onToggle,
    onNavigate,
}: {
    items: ModpackMenuItem[];
    open: boolean;
    onToggle: () => void;
    onNavigate: () => void;
}) {
    return (
        <div className="relative" data-header-dropdown-root>
            <button
                type="button"
                className="outline-none"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={onToggle}
            >
                <NavTrigger open={open}>Modpacks</NavTrigger>
            </button>
            <div
                aria-hidden={!open}
                inert={!open}
                className="absolute left-0 top-full w-[610px]"
            >
                <div className="header-dropdown-panel pt-3" data-open={open}>
                    <div className="rounded-xl bg-[#171614]/98 p-3 backdrop-blur-xl">
                        <div
                            className={`grid gap-3 ${items.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                        >
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <ModpackPreview
                                        key={item.id}
                                        item={item}
                                        onNavigate={onNavigate}
                                    />
                                ))
                            ) : (
                                <span
                                    className="min-h-[154px] animate-pulse rounded-lg bg-[#211f1b]"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                        <a
                            href="/#creations"
                            onClick={onNavigate}
                            className="site-accent-hover mt-2 inline-flex rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/50 transition-colors hover:text-[#d9b86e]"
                        >
                            View all creations
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DesktopCommunityMenu({
    open,
    onToggle,
    onNavigate,
}: {
    open: boolean;
    onToggle: () => void;
    onNavigate: () => void;
}) {
    return (
        <div className="relative" data-header-dropdown-root>
            <button
                type="button"
                className="outline-none"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={onToggle}
            >
                <NavTrigger open={open}>Community</NavTrigger>
            </button>
            <div
                aria-hidden={!open}
                inert={!open}
                className="absolute left-0 top-full w-[590px]"
            >
                <div className="header-dropdown-panel pt-3" data-open={open}>
                    <div className="grid grid-cols-[1.35fr_0.85fr] gap-3 rounded-xl bg-[#171614]/98 p-3 backdrop-blur-xl">
                        <div>
                            <span className="site-accent-text block px-3 pb-1 pt-2 font-minecraft text-[9px] uppercase tracking-[0.12em] text-[#d9b86e]">
                                Connect
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                                {communityLinks.map((item) => (
                                    <CommunityLink
                                        key={item.label}
                                        item={item}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="site-accent-text block px-3 pb-1 pt-2 font-minecraft text-[9px] uppercase tracking-[0.12em] text-[#d9b86e]">
                                Partners
                            </span>
                            <div className="grid gap-1">
                                {partnerLinks.map((item) => (
                                    <CommunityLink
                                        key={item.label}
                                        item={item}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MobileSheetGroup({
    title,
    items,
    onNavigate,
}: {
    title: string;
    items: CommunityMenuItem[];
    onNavigate: () => void;
}) {
    return (
        <div>
            <span className="site-accent-text block px-3 pb-1 pt-2 font-minecraft text-[9px] uppercase tracking-[0.12em] text-[#d9b86e]">
                {title}
            </span>
            <div className="grid gap-1 sm:grid-cols-2">
                {items.map((item) => (
                    <CommunityLink
                        key={item.label}
                        item={item}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
        </div>
    );
}

function MobileNavigation() {
    const [moreOpen, setMoreOpen] = useState(false);
    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });
    const tabActive = mobileTabs.some((tab) => tab.isActive(pathname));

    useEffect(() => {
        if (!moreOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMoreOpen(false);
        };

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [moreOpen]);

    const closeMore = () => setMoreOpen(false);

    return (
        <>
            <nav
                className="site-header fixed inset-x-0 bottom-0 z-50 bg-[#171614]/95 font-sans text-white backdrop-blur-md lg:hidden"
                aria-label="Mobile navigation"
            >
                <div className="mx-auto grid h-16 max-w-xl grid-cols-4">
                    {mobileTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = !moreOpen && tab.isActive(pathname);

                        return (
                            <a
                                key={tab.label}
                                href={tab.href}
                                aria-current={active ? "page" : undefined}
                                className={`site-accent-hover relative flex flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                                    active ? "text-[#d9b86e]" : "text-white/55"
                                }`}
                            >
                                <span
                                    className={`absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#d9b86e] transition-opacity duration-500 ${
                                        active ? "opacity-100" : "opacity-0"
                                    }`}
                                    aria-hidden="true"
                                />
                                <Icon size={20} strokeWidth={1.9} />
                                {tab.label}
                            </a>
                        );
                    })}
                    <button
                        type="button"
                        aria-expanded={moreOpen}
                        aria-haspopup="dialog"
                        onClick={() => setMoreOpen((current) => !current)}
                        className={`site-accent-hover relative flex flex-col items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                            moreOpen || !tabActive
                                ? "text-[#d9b86e]"
                                : "text-white/55"
                        }`}
                    >
                        <span
                            className={`absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-full bg-[#d9b86e] transition-opacity duration-500 ${
                                moreOpen || !tabActive
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                            aria-hidden="true"
                        />
                        <Ellipsis size={20} strokeWidth={1.9} />
                        More
                    </button>
                </div>
            </nav>

            <div
                className="mobile-sheet fixed inset-0 z-[60] lg:hidden"
                data-open={moreOpen}
                aria-hidden={!moreOpen}
                inert={!moreOpen}
            >
                <button
                    type="button"
                    className="mobile-sheet-backdrop absolute inset-0 bg-black/60"
                    aria-label="Close menu"
                    tabIndex={-1}
                    onClick={closeMore}
                />
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="More"
                    className="mobile-sheet-panel site-header-panel absolute inset-x-0 bottom-0 mx-auto max-h-[82svh] max-w-2xl overflow-y-auto rounded-t-2xl bg-[#171614] px-3 pb-6 pt-3 font-sans text-white"
                >
                    <span
                        className="mx-auto block h-1 w-10 rounded-full bg-white/15"
                        aria-hidden="true"
                    />
                    <div className="mt-3 flex items-center justify-between px-3">
                        <span className="font-minecraft text-sm uppercase tracking-[0.12em]">
                            More
                        </span>
                        <button
                            type="button"
                            onClick={closeMore}
                            className="site-accent-hover flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-white/75 transition-colors hover:text-[#d9b86e]"
                            aria-label="Close menu"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="mt-2 grid gap-3">
                        <MobileSheetGroup
                            title="Explore"
                            items={mobileExploreLinks}
                            onNavigate={closeMore}
                        />
                        <MobileSheetGroup
                            title="Connect"
                            items={communityLinks}
                            onNavigate={closeMore}
                        />
                        <MobileSheetGroup
                            title="Partners"
                            items={partnerLinks}
                            onNavigate={closeMore}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export function Header() {
    const [desktopDropdown, setDesktopDropdown] = useState<
        "modpacks" | "community" | null
    >(null);
    const { data: homepageAssets } = useHomepageAssets();
    const modpacks: ModpackMenuItem[] = [];

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (
                target instanceof Element &&
                target.closest("[data-header-dropdown-root]")
            )
                return;

            setDesktopDropdown(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;

            setDesktopDropdown(null);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    if (homepageAssets?.modpackCover && homepageAssets.modpackLogo) {
        modpacks.push({
            id: "brassworks",
            title: "Create: Brassworks",
            description:
                "Factories, exploration, and an evolving shared Create experience.",
            tag: "Play Now",
            cover: homepageAssets.modpackCover,
            logo: homepageAssets.modpackLogo,
            href: SERVER_URL,
            blue: false,
        });
    }

    const closeDesktopDropdown = () => setDesktopDropdown(null);

    return (
        <>
            <SiteAnnouncement />
            <header className="site-header fixed inset-x-0 top-0 z-50 h-[60px] bg-[#171614]/95 font-sans text-white backdrop-blur-md">
                <div className="mx-auto flex h-full w-full max-w-[1600px] items-center px-4 sm:px-8 lg:px-[60px]">
                    <a
                        href="/"
                        className="flex shrink-0 items-center gap-3 outline-none"
                        aria-label="Brassworks home"
                    >
                        <img
                            src={assetUrl("/icon.png")}
                            alt=""
                            className="h-[35px] w-[35px] object-contain"
                        />
                        <span className="flex flex-col leading-none">
                            <span className="font-minecraft text-sm uppercase tracking-[0.12em] text-white">
                                Brassworks
                            </span>
                            <span className="mb-[0.3em] mt-[0.1em] ml-[-0.05em] text-[9px] font-medium uppercase tracking-[0.14em] text-white/50">
                                Made to Create
                            </span>
                        </span>
                    </a>

                    <nav
                        className="ml-8 hidden items-center gap-0.5 lg:flex xl:ml-10"
                        aria-label="Main navigation"
                        onBlur={(event) => {
                            const nextTarget = event.relatedTarget;

                            if (
                                nextTarget instanceof Node &&
                                event.currentTarget.contains(nextTarget)
                            ) {
                                return;
                            }

                            setDesktopDropdown(null);
                        }}
                    >
                        <DesktopModpacksMenu
                            items={modpacks}
                            open={desktopDropdown === "modpacks"}
                            onToggle={() =>
                                setDesktopDropdown((current) =>
                                    current === "modpacks" ? null : "modpacks",
                                )
                            }
                            onNavigate={closeDesktopDropdown}
                        />
                        <DesktopCommunityMenu
                            open={desktopDropdown === "community"}
                            onToggle={() =>
                                setDesktopDropdown((current) =>
                                    current === "community"
                                        ? null
                                        : "community",
                                )
                            }
                            onNavigate={closeDesktopDropdown}
                        />
                        {navigation.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={closeDesktopDropdown}
                                className="site-accent-hover rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/65 transition-colors duration-300 hover:bg-white/5 hover:text-[#d9b86e] xl:px-4"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="site-primary-button group/button relative inline-flex h-10 min-w-[112px] items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#171614] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dec17c] sm:min-w-[120px] sm:px-6"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Join Now</span>
                        </a>

                        <a
                            href="/launcher"
                            className="site-accent-hover hidden rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/65 transition-colors duration-300 hover:text-[#d9b86e] lg:inline-flex"
                        >
                            Launcher
                        </a>
                        <a
                            href="/roadmap"
                            className="site-accent-hover hidden rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/65 transition-colors duration-300 hover:text-[#d9b86e] xl:inline-flex"
                        >
                            Roadmap
                        </a>
                    </div>
                </div>
            </header>
            <MobileNavigation />
        </>
    );
}
