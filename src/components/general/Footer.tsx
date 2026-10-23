import {
    SiDiscord,
    SiGithub,
    SiModrinth,
    SiYoutube,
} from "@icons-pack/react-simple-icons";
import { CloudDownload, Server } from "lucide-react";
import { assetUrl } from "../../lib/assets.js";

const DISCORD_URL = "https://discord.gg/brassworks";
const GITHUB_URL = "https://github.com/Brassworks-smp";
const MAVEN_URL = "https://maven.opnsoc.org/";
const MODRINTH_URL = "https://modrinth.com/organization/brassworks";
const OBSIDIAN_SERVERS_URL =
    "https://obsidianservers.com/partner/brassworks-smp";
const SNOWGO_URL = "https://www.youtube.com/@snowy-go";
const YOUTUBE_URL = "https://www.youtube.com/@BrassworksSMP";

const socialLinks = [
    { label: "Discord", href: DISCORD_URL, icon: SiDiscord },
    { label: "GitHub", href: GITHUB_URL, icon: SiGithub },
    { label: "Modrinth", href: MODRINTH_URL, icon: SiModrinth },
    { label: "YouTube", href: YOUTUBE_URL, icon: SiYoutube },
    { label: "Maven", href: MAVEN_URL, icon: CloudDownload },
    { label: "Obsidian Servers", href: OBSIDIAN_SERVERS_URL, icon: Server },
];

const footerGroups = [
    {
        title: "Projects",
        links: [
            { label: "Creations", href: "/#creations" },
            { label: "Mods", href: "/#mods" },
            { label: "Team", href: "/#team" },
            { label: "Launcher", href: "/launcher" },
            { label: "Maven", href: MAVEN_URL },
        ],
    },
    {
        title: "Explore",
        links: [
            { label: "Docs", href: "/docs" },
            { label: "News", href: "/news" },
            { label: "Media", href: "/#media" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Finances", href: "/finances" },
        ],
    },
    {
        title: "Community",
        links: [
            { label: "Discord", href: DISCORD_URL },
            { label: "GitHub", href: GITHUB_URL },
            { label: "Modrinth", href: MODRINTH_URL },
            { label: "YouTube", href: YOUTUBE_URL },
        ],
    },
    {
        title: "Partners",
        links: [
            { label: "SnowGo", href: SNOWGO_URL },
            { label: "Obsidian Servers", href: OBSIDIAN_SERVERS_URL },
        ],
    },
];

export function Footer() {
    return (
        <footer className="site-footer border-t border-white/6 bg-[#0d0c0b] px-4 text-white sm:px-8 lg:px-[60px]">
            <div className="mx-auto grid max-w-[1600px] gap-12 py-12 md:grid-cols-[minmax(260px,1.4fr)_2fr] lg:gap-20 lg:py-16">
                <div>
                    <a href="/" className="inline-flex items-center gap-3">
                        <img
                            src={assetUrl("/icon.png")}
                            alt=""
                            className="h-[35px] w-[35px] object-contain"
                        />
                        <span className="flex flex-col leading-none">
                            <span className="font-minecraft text-base uppercase tracking-[0.12em]">
                                Brassworks
                            </span>
                            <span className="mb-[0.3em] mt-[0.1em] ml-[-0.05em] text-[9px] font-medium uppercase tracking-[0.14em] text-white/50">
                                Made to Create
                            </span>
                        </span>
                    </a>
                    <p className="mt-5 max-w-md text-sm font-medium leading-6 text-white/52">
                        Mods, modpacks, worlds, and tools made by people who
                        love building things together.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {socialLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.label}
                                    className="site-accent-hover-bg site-icon-button flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/55 hover:bg-[#c7a35a] hover:text-[#171614]"
                                >
                                    <Icon size={18} color="currentColor" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 xl:grid-cols-4">
                    {footerGroups.map((group) => (
                        <div key={group.title}>
                            <h2 className="site-accent-text font-minecraft text-xs uppercase tracking-[0.12em] text-[#d9b86e]">
                                {group.title}
                            </h2>
                            <ul className="mt-4 grid gap-3">
                                {group.links.map((item) => {
                                    const external =
                                        item.href.startsWith("http");

                                    return (
                                        <li key={item.label}>
                                            <a
                                                href={item.href}
                                                target={
                                                    external
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    external
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className="site-interactive text-sm font-semibold text-white/52 transition-colors hover:text-white"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-[1600px] flex-col gap-2 border-t border-white/6 py-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
                <span>© {new Date().getFullYear()} Brassworks</span>
                <span>
                    Not an official Minecraft product. Not approved by or
                    associated with Mojang or Microsoft
                </span>
            </div>
        </footer>
    );
}
