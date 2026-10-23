import { SiApple, SiLinux } from "@icons-pack/react-simple-icons";
import { type ComponentType, createElement } from "react";
import {
    ArrowUpRight,
    Boxes,
    Globe,
    LockKeyhole,
    Package,
    Play,
    Server,
    Shirt,
} from "lucide-react";
import type {
    LauncherImageKey,
    LauncherThemeId,
} from "../../features/launcher-assets/launcher-assets.service";
import type {
    LauncherRelease,
    LauncherReleaseAsset,
} from "../../features/launcher-release/launcher-release.service";

export const SOURCE_URL =
    "https://github.com/Brassworks-smp/BrassworksLauncher";
export const CROWDIN_URL = "https://crowdin.com/project/brassworks-launcher";

export type LauncherTheme = {
    id: LauncherThemeId;
    name: string;
    label: string;
    description: string;
    accent: string;
    accentHover: string;
    accentSecondary: string;
    accentTertiary: string;
    accentText: string;
    palette: string[];
};

export const launcherThemes: LauncherTheme[] = [
    {
        id: "green",
        name: "Green",
        label: "Green",
        description:
            "Deep greens, bright growth, and the launcher's native look.",
        accent: "#21c66f",
        accentHover: "#45db88",
        accentSecondary: "#68d4b1",
        accentTertiary: "#a7df72",
        accentText: "#0d1811",
        palette: [
            "#21c66f",
            "#68d4b1",
            "#a7df72",
            "#55b98a",
            "#8ed9df",
            "#d5e889",
        ],
    },
    {
        id: "brass",
        name: "Brass",
        label: "Brass",
        description:
            "The warm brass and copper palette used across Brassworks.",
        accent: "#c7a35a",
        accentHover: "#dec17c",
        accentSecondary: "#d9b86e",
        accentTertiary: "#e6a35c",
        accentText: "#171614",
        palette: [
            "#c7a35a",
            "#d9b86e",
            "#e6a35c",
            "#b88952",
            "#dec17c",
            "#d58b6f",
        ],
    },
    {
        id: "ocean",
        name: "Ocean",
        label: "Cool",
        description:
            "Cool blues, clean contrast, and a brighter technical edge.",
        accent: "#06b6d4",
        accentHover: "#22d3ee",
        accentSecondary: "#67e8f9",
        accentTertiary: "#60a5fa",
        accentText: "#0c171c",
        palette: [
            "#06b6d4",
            "#22d3ee",
            "#67e8f9",
            "#60a5fa",
            "#38bdf8",
            "#a5f3fc",
        ],
    },
];

export const launcherThemePreview: Record<LauncherThemeId, LauncherImageKey> = {
    green: "servers",
    brass: "instances",
    ocean: "skins",
};

export type Platform = "windows" | "macos" | "linux";

type PlatformIconProps = {
    className?: string;
    color?: string;
    size?: number;
};

function WindowsIcon({
    className,
    color = "currentColor",
    size = 24,
}: PlatformIconProps) {
    return createElement(
        "svg",
        {
            "aria-hidden": true,
            className,
            fill: color,
            height: size,
            viewBox: "0 0 24 24",
            width: size,
        },
        createElement("path", {
            d: "M3 5.25 10.5 4.2v7.3H3V5.25Zm8.5-1.19L21 2.75v8.75h-9.5V4.06ZM3 12.5h7.5v7.3L3 18.75V12.5Zm8.5 0H21v8.75l-9.5-1.31V12.5Z",
        }),
    );
}

export const platformIcons: Record<
    Platform,
    ComponentType<PlatformIconProps>
> = {
    windows: WindowsIcon,
    macos: SiApple,
    linux: SiLinux,
};

export type PlatformDownload = {
    label: string;
    shortLabel: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    options: Array<{
        label: string;
        meta: string;
        href: string;
    }>;
};

const platformDetails: Record<
    Platform,
    Pick<PlatformDownload, "label" | "shortLabel" | "description">
> = {
    windows: {
        label: "Windows",
        shortLabel: "Windows",
        description: "For Windows 10 and 11 on x64 or ARM64.",
    },
    macos: {
        label: "macOS",
        shortLabel: "macOS",
        description: "One universal build for Apple silicon and Intel Macs.",
    },
    linux: {
        label: "Linux",
        shortLabel: "Linux",
        description: "Packages for the distributions you already use.",
    },
};

function assetFormat(name: string) {
    const lowerName = name.toLowerCase();

    if (lowerName.endsWith(".tar.gz")) return "TAR.GZ";
    if (lowerName.endsWith(".appimage")) return "AppImage";

    const extension = lowerName.match(/\.([a-z0-9]+)$/)?.[1];

    return extension?.toUpperCase() || "Package";
}

function matchesPlatform(asset: LauncherReleaseAsset, platform: Platform) {
    const name = asset.name.toLowerCase();

    if (platform === "windows") return /\.(?:msi|exe)$/i.test(name);
    if (platform === "macos") {
        return /\.(?:dmg|pkg)$/i.test(name) || /(?:macos|darwin)/i.test(name);
    }

    return (
        /\.(?:appimage|deb|rpm|flatpak|snap)$/i.test(name) ||
        /(?:linux|archlinux)/i.test(name)
    );
}

function assetLabel(platform: Platform, asset: LauncherReleaseAsset) {
    const name = asset.name.toLowerCase();

    if (platform === "windows") {
        return /(?:arm64|aarch64)/i.test(name)
            ? "Windows ARM64"
            : "Windows x64";
    }

    if (platform === "macos") {
        return /(?:arm64|aarch64|apple)/i.test(name)
            ? "Apple silicon"
            : "Intel Mac";
    }

    if (name.endsWith(".appimage")) return "AppImage";
    if (name.endsWith(".deb")) return "Debian / Ubuntu";
    if (name.endsWith(".rpm")) return "Fedora / RHEL";
    if (name.endsWith(".flatpak")) return "Flatpak";
    if (name.endsWith(".snap")) return "Snap";

    return "Linux package";
}

function createLinuxOptions(
    assets: LauncherReleaseAsset[],
    primary: LauncherReleaseAsset | undefined,
): PlatformDownload["options"] {
    const uniqueOptions = new Map<
        string,
        {
            asset: LauncherReleaseAsset;
            label: string;
            order: number;
        }
    >();

    assets.forEach((asset) => {
        const name = asset.name.toLowerCase();
        const architecture = /(?:arm64|aarch64)/i.test(name)
            ? "arm64"
            : /(?:x86[_-]?64|amd64|x64)/i.test(name)
              ? "x86_64"
              : null;
        const format = name.endsWith(".deb")
            ? "deb"
            : name.endsWith(".rpm")
              ? "rpm"
              : name.endsWith(".appimage")
                ? "appimage"
                : null;

        if (!architecture || !format) return;

        const key = `${architecture}-${format}`;

        if (uniqueOptions.has(key)) return;

        const architectureLabel = architecture === "arm64" ? "ARM64" : "x86_64";
        const formatLabel =
            format === "deb"
                ? "Debian / Ubuntu"
                : format === "rpm"
                  ? "Fedora / RHEL"
                  : "Portable";
        const architectureOrder = architecture === "x86_64" ? 0 : 3;
        const formatOrder = format === "deb" ? 0 : format === "rpm" ? 1 : 2;

        uniqueOptions.set(key, {
            asset,
            label: `${formatLabel} ${architectureLabel}`,
            order: architectureOrder + formatOrder,
        });
    });

    return [...uniqueOptions.values()]
        .sort((a, b) => a.order - b.order)
        .map(({ asset, label }) => ({
            label,
            meta: `${assetFormat(asset.name)} package${
                asset === primary ? " · Recommended" : ""
            }`,
            href: asset.url,
        }));
}

function preferredAsset(platform: Platform, assets: LauncherReleaseAsset[]) {
    if (platform === "windows") {
        return (
            assets.find((asset) =>
                /(?:x64|x86_64|amd64).*\.msi$/i.test(asset.name),
            ) ??
            assets.find((asset) => /\.msi$/i.test(asset.name)) ??
            assets[0]
        );
    }

    if (platform === "macos") {
        return (
            assets.find((asset) =>
                /(?:arm64|aarch64|apple).*\.dmg$/i.test(asset.name),
            ) ??
            assets.find((asset) => /\.dmg$/i.test(asset.name)) ??
            assets[0]
        );
    }

    return (
        assets.find(
            (asset) =>
                /(?:x86[_-]?64|amd64|x64)/i.test(asset.name) &&
                /\.appimage$/i.test(asset.name),
        ) ??
        assets.find((asset) => /\.appimage$/i.test(asset.name)) ??
        assets[0]
    );
}

export function createPlatformDownloads(
    release: LauncherRelease,
): Record<Platform, PlatformDownload> {
    return (Object.keys(platformDetails) as Platform[]).reduce(
        (downloads, platform) => {
            const assets = release.assets.filter((asset) =>
                matchesPlatform(asset, platform),
            );
            const primary = preferredAsset(platform, assets);
            const details = platformDetails[platform];
            const options =
                platform === "linux"
                    ? createLinuxOptions(assets, primary)
                    : assets.map((asset) => ({
                          label:
                              platform === "macos" && assets.length === 1
                                  ? "macOS Universal"
                                  : assetLabel(platform, asset),
                          meta: `${assetFormat(asset.name)} package${
                              asset === primary ? " · Recommended" : ""
                          }`,
                          href: asset.url,
                      }));

            downloads[platform] = {
                ...details,
                primaryLabel: primary
                    ? `Download ${assetFormat(primary.name)}`
                    : `View ${details.label} builds`,
                primaryHref: primary?.url ?? release.url,
                options:
                    options.length > 0
                        ? options
                        : [
                              {
                                  label: `${details.label} downloads`,
                                  meta: `View release ${release.version}`,
                                  href: release.url,
                              },
                          ],
            };

            return downloads;
        },
        {} as Record<Platform, PlatformDownload>,
    );
}

export const features = [
    {
        id: "play",
        imageKey: "play" as LauncherImageKey,
        icon: Play,
        title: "One click to play",
        description:
            "Everything for your active instance lives on one screen: pack version, playtime, server news, update state, and the button that gets you into the game.",
    },
    {
        id: "instances",
        imageKey: "instances" as LauncherImageKey,
        icon: Boxes,
        title: "Every world in its place",
        description:
            "Keep featured packs, custom instances, and different mod loaders organised in folders without turning your library into a wall of identical tiles.",
    },
    {
        id: "content",
        imageKey: "content" as LauncherImageKey,
        icon: Package,
        title: "Content without the busywork",
        description:
            "Find, install, update, and toggle content from Modrinth and CurseForge, then browse and import schematics through the CreateMod.com integration.",
    },
    {
        id: "skins",
        imageKey: "skins" as LauncherImageKey,
        icon: Shirt,
        title: "A look for every world",
        description:
            "Build skin and cape presets as complete loadouts, inspect them on a live 3D model, and switch your look before you launch.",
    },
    {
        id: "worlds",
        imageKey: "worlds" as LauncherImageKey,
        icon: Globe,
        title: "Worlds and backups",
        description:
            "See gamemode, seed, size, and last played information at a glance, then create backups or manage datapacks without digging through folders.",
    },
    {
        id: "servers",
        imageKey: "servers" as LauncherImageKey,
        icon: Server,
        title: "Servers at a glance",
        description:
            "Star your favourites, watch live player counts and ping, and keep the Brassworks server ready beside every other place you play.",
    },
];

export const foundation = [
    {
        title: "Native where it matters",
        description:
            "A focused Rust core handles the heavy lifting while the interface stays fast and familiar.",
        icon: Boxes,
    },
    {
        title: "Java, handled",
        description:
            "Required Java runtimes are provisioned automatically for each Minecraft version.",
        icon: Play,
    },
    {
        title: "Updates that recover",
        description:
            "Pack updates are resumable and hash-verified, so interrupted downloads do not mean starting over.",
        icon: ArrowUpRight,
    },
    {
        title: "Open from the start",
        description:
            "The launcher is free software under GPL-3.0-or-later, developed in public on GitHub.",
        icon: LockKeyhole,
    },
];

export function detectPlatform(): Platform {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes("mac") || userAgent.includes("mac os"))
        return "macos";
    if (platform.includes("linux") || userAgent.includes("linux"))
        return "linux";
    return "windows";
}
