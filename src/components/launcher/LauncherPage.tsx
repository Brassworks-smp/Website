import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "../general/Footer";
import { Header } from "../general/Header";
import { ButtonWipe } from "../general/ButtonWipe";
import { useLauncherAssets } from "../../features/launcher-assets/use-launcher-assets";
import type { LauncherThemeId } from "../../features/launcher-assets/launcher-assets.service";
import { useLauncherRelease } from "../../features/launcher-release/use-launcher-release";
import { LauncherClosingSection } from "./LauncherClosingSection";
import { LauncherHeroSection } from "./LauncherHeroSection";
import {
    createPlatformDownloads,
    detectPlatform,
    features,
    foundation,
    launcherThemePreview,
    launcherThemes,
    type Platform,
    platformIcons,
} from "./launcher-config";

export function LauncherPage() {
    const [platform, setPlatform] = useState<Platform>("windows");
    const [activeFeature, setActiveFeature] = useState(features[0].id);
    const [themeId, setThemeId] = useState<LauncherThemeId>("brass");
    const {
        data: launcherAssets = {},
        isPending: assetsPending,
        isError: assetsError,
    } = useLauncherAssets();
    const {
        data: release,
        isPending: releasePending,
        isError: releaseError,
    } = useLauncherRelease();
    const platformDownloads = useMemo(
        () => (release ? createPlatformDownloads(release) : null),
        [release],
    );
    const availableThemes = useMemo(
        () => launcherThemes.filter((theme) => launcherAssets[theme.id]),
        [launcherAssets],
    );

    useEffect(() => {
        setPlatform(detectPlatform());

        setThemeId("brass");
        document.documentElement.dataset.siteTheme = "brass";

        return () => {
            document.documentElement.dataset.siteTheme = "brass";
        };
    }, []);

    useEffect(() => {
        if (availableThemes.length === 0) return;
        if (availableThemes.some((theme) => theme.id === themeId)) return;

        const nextTheme =
            availableThemes.find((theme) => theme.id === "brass") ??
            availableThemes[0];

        if (!nextTheme) return;

        setThemeId(nextTheme.id);
        document.documentElement.dataset.siteTheme = nextTheme.id;
    }, [availableThemes, themeId]);

    const selectedPlatform = platformDownloads?.[platform];
    const SelectedPlatformIcon = platformIcons[platform];
    const selectedTheme = availableThemes.find((theme) => theme.id === themeId);
    const activeThemeAssets = launcherAssets[themeId];
    const selectedFeature = useMemo(
        () => features.find((feature) => feature.id === activeFeature)!,
        [activeFeature],
    );

    const selectTheme = (nextTheme: LauncherThemeId) => {
        setThemeId(nextTheme);
        document.documentElement.dataset.siteTheme = nextTheme;

        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
        });
    };

    if (
        assetsPending ||
        assetsError ||
        releasePending ||
        releaseError ||
        !release ||
        !platformDownloads ||
        !selectedPlatform ||
        !selectedTheme ||
        !activeThemeAssets
    ) {
        return (
            <div className="launcher-theme-root" data-active-theme="brass">
                <Header />
                <main className="min-h-screen bg-[#171614] pt-[60px]" />
                <Footer />
            </div>
        );
    }

    const activeImages = activeThemeAssets.images;

    return (
        <div className="launcher-theme-root" data-active-theme={themeId}>
            <Header />
            <main className="launcher-page overflow-hidden bg-[#171614] pt-[60px] text-white">
                <LauncherHeroSection
                    themeId={themeId}
                    assets={activeThemeAssets}
                    platform={selectedPlatform}
                    version={release.version}
                />

                <section className="px-3 pb-20 sm:px-6 sm:pb-24 lg:px-[60px] lg:pb-28">
                    <div className="mx-auto grid max-w-[1600px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {foundation.map((item, index) => {
                            const Icon = item.icon;
                            const itemAccent =
                                selectedTheme.palette[
                                    index % selectedTheme.palette.length
                                ];

                            return (
                                <div
                                    key={item.title}
                                    className="launcher-panel group cursor-pointer transform-gpu rounded-xl bg-[#1d1b18] px-6 py-7 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-0.5 sm:px-7"
                                >
                                    <span
                                        className="flex h-9 w-9 transform-gpu items-center justify-center rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${itemAccent} 14%, transparent)`,
                                        }}
                                    >
                                        <Icon
                                            className="h-5 w-5"
                                            strokeWidth={1.8}
                                            style={{ color: itemAccent }}
                                        />
                                    </span>
                                    <h2 className="mt-5 text-sm font-bold text-white/90">
                                        {item.title}
                                    </h2>
                                    <p className="mt-2 text-sm font-medium leading-6 text-white/48">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="px-3 pb-24 sm:px-6 sm:pb-28 lg:px-[60px] lg:pb-32">
                    <div className="mx-auto max-w-[1600px]">
                        <header className="max-w-3xl">
                            <span className="launcher-secondary-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#65c7d0]">
                                Everything in one place
                            </span>
                            <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                Built around how you play.
                            </h2>
                            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/62 sm:text-base">
                                Less setup, fewer scattered tools, and no
                                digging through game folders just to change one
                                thing.
                            </p>
                        </header>

                        <div className="mt-11 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                                {features.map((feature, index) => {
                                    const isActive =
                                        feature.id === selectedFeature.id;
                                    const FeatureIcon = feature.icon;
                                    const featureAccent =
                                        selectedTheme.palette[
                                            index % selectedTheme.palette.length
                                        ];

                                    return (
                                        <button
                                            key={feature.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveFeature(feature.id)
                                            }
                                            aria-pressed={isActive}
                                            className={`launcher-panel launcher-feature-card group flex w-full transform-gpu cursor-pointer items-center gap-4 rounded-xl px-4 py-4 text-left outline-none transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:translate-x-0.5 sm:px-5 ${isActive ? "launcher-surface-strong bg-[#211f1b]" : "bg-[#1d1b18]"}`}
                                        >
                                            <span
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ${isActive ? "text-[#171614]" : "bg-white/5 text-white/48 group-hover:text-white"}`}
                                                style={
                                                    isActive
                                                        ? {
                                                              backgroundColor:
                                                                  featureAccent,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                <FeatureIcon
                                                    className="h-5 w-5"
                                                    strokeWidth={1.8}
                                                />
                                            </span>
                                            <span className="min-w-0">
                                                <strong className="block text-sm text-white/90">
                                                    {feature.title}
                                                </strong>
                                                <span className="mt-1 hidden text-xs font-medium leading-5 text-white/44 xl:block">
                                                    {feature.description}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative flex min-h-[390px] items-center sm:min-h-[520px] lg:min-h-[610px]">
                                {activeImages[selectedFeature.imageKey] ? (
                                    <img
                                        key={`${themeId}-${selectedFeature.id}`}
                                        src={
                                            activeImages[
                                                selectedFeature.imageKey
                                            ]
                                        }
                                        alt={`${selectedFeature.title} in Brassworks Launcher`}
                                        className="launcher-motion -mx-[4%] block max-h-[570px] w-[108%] max-w-none rounded-[10px] object-contain animate-[launcher-preview-in_760ms_cubic-bezier(0.22,1,0.36,1)_both]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : null}
                                <div className="launcher-deep absolute inset-x-4 -bottom-4 rounded-lg bg-[#171614]/92 px-5 py-4 backdrop-blur-md lg:hidden">
                                    <h3 className="text-sm font-bold text-white">
                                        {selectedFeature.title}
                                    </h3>
                                    <p className="mt-1 text-xs font-medium leading-5 text-white/52">
                                        {selectedFeature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="launcher-showcase-shell relative isolate overflow-hidden">
                    <svg
                        className="launcher-showcase-cut launcher-showcase-cut-top"
                        viewBox="0 0 400 72"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path d="M 400 0 H 326 Q 296 0 296 30 V 42 Q 296 72 266 72 H 0 V 0 Z" />
                    </svg>
                    <svg
                        className="launcher-showcase-cut launcher-showcase-cut-bottom"
                        viewBox="0 0 400 72"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path d="M 400 0 H 326 Q 296 0 296 30 V 42 Q 296 72 266 72 H 0 V 0 Z" />
                    </svg>
                    <section className="px-3 py-20 sm:px-6 sm:py-24 lg:px-[60px] lg:py-28">
                        <div className="relative mx-auto max-w-[1600px]">
                            <div className="grid items-center gap-12 px-7 py-14 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:px-16 xl:px-20">
                                <div className="order-2 lg:order-1">
                                    <div className="relative mr-auto max-w-[820px]">
                                        {activeImages.export ? (
                                            <img
                                                key={`${themeId}-export`}
                                                src={activeImages.export}
                                                alt="Brassworks Launcher modpack export window"
                                                className="launcher-motion -ml-[8%] -mr-[2%] block h-auto w-[110%] max-w-none rounded-[10px] animate-[launcher-share-primary-in_850ms_cubic-bezier(0.22,1,0.36,1)_both]"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : null}
                                        {activeImages.sharing ? (
                                            <img
                                                key={`${themeId}-sharing`}
                                                src={activeImages.sharing}
                                                alt="Brassworks Launcher pack sharing window"
                                                className="launcher-motion -mr-[4%] -mt-[18%] ml-auto block h-auto w-[88%] max-w-none rounded-[10px] animate-[launcher-share-secondary-in_950ms_120ms_cubic-bezier(0.22,1,0.36,1)_both] sm:-mt-[24%] sm:w-[78%]"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : null}
                                    </div>
                                </div>

                                <div className="order-1 max-w-xl lg:order-2">
                                    <span className="launcher-secondary-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#68d4b1]">
                                        Made to move
                                    </span>
                                    <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                        Build it. Share it. Keep it synced.
                                    </h2>
                                    <p className="mt-5 text-sm font-semibold leading-7 text-white/62 sm:text-base">
                                        Export an instance as packwiz, a
                                        Modrinth pack, or a CurseForge archive.
                                        Choose exactly what belongs in the pack,
                                        publish it, and give friends a copy that
                                        can keep itself up to date.
                                    </p>
                                    <ul className="mt-7 grid gap-3 text-sm font-semibold text-white/68">
                                        {[
                                            "Pick files, mods, configs, and optional content",
                                            "Create flavour groups for different setups",
                                            "Publish through GitHub or GitLab",
                                            "Open install links directly in the launcher",
                                        ].map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="launcher-secondary mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#68d4b1] text-[#13201c]">
                                                    <span className="text-[11px] font-bold">
                                                        ✓
                                                    </span>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="px-3 py-20 sm:px-6 sm:py-24 lg:px-[60px] lg:py-28">
                        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
                            <div className="max-w-xl">
                                <span className="launcher-tertiary-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#a99af2]">
                                    Command palette and CLI
                                </span>
                                <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                    Every action, a few keys away.
                                </h2>
                                <p className="mt-5 text-sm font-semibold leading-7 text-white/62 sm:text-base">
                                    Search for actions with Ctrl K, use
                                    Discord-style slash commands in the app, or
                                    install the same command set for your
                                    terminal.
                                </p>

                                <div className="launcher-deep mt-8 overflow-hidden rounded-xl bg-[#0d0c0b]">
                                    <div className="flex items-center gap-2 bg-white/[0.025] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/36">
                                        <span className="launcher-tertiary-text font-minecraft text-[#a99af2]">
                                            /
                                        </span>{" "}
                                        Launcher commands
                                    </div>
                                    <pre className="overflow-x-auto px-5 py-5 text-xs font-medium leading-7 text-white/62 sm:text-sm">
                                        <code>{`/instance launch survival
/content install sodium --source modrinth
/modpack sync
/world backup survival
/skin apply knight`}</code>
                                    </pre>
                                </div>
                            </div>

                            {activeImages.command ? (
                                <img
                                    key={`${themeId}-command`}
                                    src={activeImages.command}
                                    alt="Command palette in Brassworks Launcher"
                                    className="launcher-motion -mx-[4%] block h-auto w-[108%] max-w-none rounded-[10px] animate-[launcher-window-in_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                                    loading="lazy"
                                    decoding="async"
                                />
                            ) : null}
                        </div>
                    </section>

                    <section className="px-3 py-20 sm:px-6 sm:py-24 lg:px-[60px] lg:py-28">
                        <div className="relative mx-auto max-w-[1600px]">
                            <header className="mx-auto max-w-3xl text-center">
                                <span className="launcher-accent-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#8ed9df]">
                                    Make it yours
                                </span>
                                <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                    Your launcher should feel like yours.
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/62 sm:text-base">
                                    Pick a look and watch this page, its
                                    controls, and its launcher previews shift
                                    with it.
                                </p>
                            </header>

                            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6 lg:gap-10">
                                {availableThemes.map((theme) => {
                                    const isActive = theme.id === themeId;
                                    const previewImage =
                                        launcherAssets[theme.id]?.images[
                                            launcherThemePreview[theme.id]
                                        ];

                                    return (
                                        <button
                                            key={theme.name}
                                            type="button"
                                            onClick={() =>
                                                selectTheme(theme.id)
                                            }
                                            aria-pressed={isActive}
                                            className="group min-w-0 cursor-pointer text-left outline-none"
                                        >
                                            <div className="relative aspect-[35/18] overflow-hidden rounded-[10px] bg-black/20 transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt={`${theme.name} theme in Brassworks Launcher`}
                                                        className="launcher-motion absolute inset-0 block h-full w-full object-contain object-center opacity-[0.88] transition-opacity duration-[800ms] group-hover:opacity-100 group-focus-visible:opacity-100"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : null}
                                                <span
                                                    className="absolute left-4 top-4 rounded-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                                                    style={{
                                                        backgroundColor:
                                                            theme.accent,
                                                        color: theme.accentText,
                                                    }}
                                                >
                                                    {theme.label}
                                                </span>
                                            </div>
                                            <div className="px-1 pt-5">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="font-minecraft text-sm font-bold text-white/90">
                                                        {theme.name}
                                                    </span>
                                                    <span
                                                        className="rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] transition-[opacity,transform] duration-500"
                                                        style={{
                                                            color: theme.accent,
                                                            opacity: isActive
                                                                ? 1
                                                                : 0,
                                                            transform: isActive
                                                                ? "translateY(0)"
                                                                : "translateY(3px)",
                                                        }}
                                                    >
                                                        Active
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-xs font-medium leading-5 text-white/48">
                                                    {theme.description}
                                                </p>
                                                <div className="mt-4 flex items-center gap-1.5">
                                                    {theme.palette
                                                        .slice(0, 4)
                                                        .map((color) => (
                                                            <span
                                                                key={color}
                                                                className="h-2.5 w-6 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        color,
                                                                }}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-white/42">
                                <span className="inline-flex items-center gap-2">
                                    <span className="launcher-tertiary h-2 w-2 rounded-full" />{" "}
                                    Windows, macOS, Linux
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className="launcher-secondary h-2 w-2 rounded-full" />{" "}
                                    Instant theme switching
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                <section
                    id="download"
                    className="scroll-mt-24 px-3 py-20 sm:px-6 sm:py-24 lg:px-[60px] lg:py-28"
                >
                    <div className="mx-auto max-w-[1300px]">
                        <header className="mx-auto max-w-3xl text-center">
                            <span className="launcher-accent-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em]">
                                Download
                            </span>
                            <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                Pick your platform and play.
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-white/62 sm:text-base">
                                Version {release.version} is the latest release.
                                Choose the build that matches your system.
                            </p>
                        </header>

                        <div className="mt-10 flex justify-center">
                            <div className="launcher-surface-strong inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#211f1b] p-1.5">
                                {(
                                    Object.keys(platformDownloads) as Platform[]
                                ).map((item) => {
                                    const option = platformDownloads[item];
                                    const isActive = platform === item;
                                    const PlatformIcon = platformIcons[item];

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setPlatform(item)}
                                            aria-pressed={isActive}
                                            className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 text-xs font-bold uppercase tracking-[0.08em] transition-colors duration-300 sm:px-5 ${isActive ? "text-[#171614]" : "text-white/52 hover:bg-white/5 hover:text-white"}`}
                                            style={
                                                isActive
                                                    ? {
                                                          backgroundColor:
                                                              selectedTheme.accent,
                                                      }
                                                    : undefined
                                            }
                                        >
                                            <PlatformIcon
                                                className="opacity-70"
                                                color="currentColor"
                                                size={16}
                                            />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className="launcher-surface-strong mt-6 overflow-hidden rounded-xl bg-[#211f1b]"
                            style={
                                {
                                    "--platform-accent": selectedTheme.accent,
                                    "--platform-accent-soft": `color-mix(in srgb, ${selectedTheme.accent} 10%, transparent)`,
                                } as CSSProperties
                            }
                        >
                            <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
                                <div className="flex flex-col justify-between p-7 sm:p-9">
                                    <div>
                                        <span
                                            className="flex h-12 w-12 items-center justify-center rounded-xl text-[#171614]"
                                            style={{
                                                backgroundColor:
                                                    selectedTheme.accent,
                                            }}
                                        >
                                            <SelectedPlatformIcon
                                                color="currentColor"
                                                size={20}
                                            />
                                        </span>
                                        <h3 className="mt-7 font-minecraft text-2xl font-bold sm:text-3xl">
                                            Brassworks for{" "}
                                            {selectedPlatform.label}
                                        </h3>
                                        <p className="mt-3 text-sm font-medium leading-6 text-white/54">
                                            {selectedPlatform.description}
                                        </p>
                                    </div>

                                    <a
                                        href={selectedPlatform.primaryHref}
                                        className="launcher-primary group/button relative mt-8 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                                    >
                                        <ButtonWipe />
                                        <span className="relative z-10">
                                            {selectedPlatform.primaryLabel}
                                        </span>
                                    </a>
                                </div>

                                <div
                                    key={platform}
                                    className="grid gap-2 p-2 sm:grid-cols-2"
                                >
                                    {selectedPlatform.options.map((option) => (
                                        <a
                                            key={`${platform}-${option.href}`}
                                            href={option.href}
                                            className={`launcher-panel launcher-download-card group flex min-h-32 transform-gpu cursor-pointer items-center gap-4 rounded-lg bg-[#1d1b18] px-6 py-6 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:translate-x-0.5 ${selectedPlatform.options.length === 1 ? "sm:col-span-2" : ""}`}
                                        >
                                            <span>
                                                <strong className="block text-sm text-white/88">
                                                    {option.label}
                                                </strong>
                                                <span className="mt-1 block text-xs font-medium text-white/42">
                                                    {option.meta}
                                                </span>
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col items-center justify-between gap-4 text-xs font-medium text-white/38 sm:flex-row">
                            <span>
                                Downloads are served through the official GitHub
                                release.
                            </span>
                            <a
                                href={release.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="launcher-accent-text inline-flex cursor-pointer items-center gap-1.5 font-bold transition-opacity hover:opacity-75"
                            >
                                Browse releases{" "}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </section>

                <LauncherClosingSection assets={activeThemeAssets} />
            </main>
            <Footer />
        </div>
    );
}
