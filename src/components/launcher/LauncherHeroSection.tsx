import type {
    LauncherThemeAssets,
    LauncherThemeId,
} from "../../features/launcher-assets/launcher-assets.service";
import { useHandheldDevice } from "../../lib/use-mobile-layout";
import { ButtonWipe } from "../general/ButtonWipe";
import { ShareLauncherButton } from "../general/ClosingSection";
import type { PlatformDownload } from "./launcher-config";

type LauncherHeroSectionProps = {
    themeId: LauncherThemeId;
    assets: LauncherThemeAssets;
    platform: PlatformDownload;
    version: string;
};

export function LauncherHeroSection({
    themeId,
    assets,
    platform,
    version,
}: LauncherHeroSectionProps) {
    const handheld = useHandheldDevice();

    return (
        <section className="px-3 pb-16 pt-5 sm:px-6 sm:pb-20 sm:pt-8 lg:px-[60px] lg:pb-24">
            <div className="launcher-hero-shell launcher-surface-strong outer relative isolate mx-auto min-h-[610px] max-w-[1600px] overflow-hidden bg-[#211f1b] sm:min-h-[650px]">
                <img
                    key={`${themeId}-${assets.heroBg}`}
                    src={assets.heroBg}
                    alt=""
                    className="launcher-motion launcher-theme-background absolute -inset-[2px] -z-30 h-[calc(100%+4px)] w-[calc(100%+4px)] object-cover object-center opacity-[0.55]"
                    draggable="false"
                    decoding="async"
                />
                <div className="launcher-hero-mask absolute -inset-[2px] -z-20" />
                <div className="launcher-hero-bottom-mask absolute -inset-[2px] -z-10" />

                <div className="grid min-h-[610px] items-center gap-12 px-7 py-16 sm:min-h-[650px] sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-16 xl:px-24">
                    <div className="relative z-10 max-w-xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="launcher-primary rounded-md bg-[#65c7d0] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#111719]">
                                Available Now
                            </span>
                            <span className="text-xs font-semibold text-white/48">
                                Version {version}
                            </span>
                        </div>

                        <h1 className="mt-7 font-minecraft text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl xl:text-7xl">
                            Play more.
                            <span className="launcher-accent-text block text-[#8ed9df]">
                                Manage less.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-white/66 sm:text-lg">
                            Brassworks Launcher keeps modpacks, updates,
                            content, worlds, skins, and servers together in one
                            fast native app.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            {handheld ? (
                                <ShareLauncherButton className="launcher-primary min-h-12 bg-[#c7a35a] text-[#171614]" />
                            ) : (
                                <a
                                    href={platform.primaryHref}
                                    className="launcher-primary group/button relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                                >
                                    <ButtonWipe />
                                    <span className="relative z-10">
                                        Download for {platform.shortLabel}
                                    </span>
                                </a>
                            )}
                            <a
                                href="#download"
                                className="launcher-deep group/button relative inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#171614] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
                            >
                                <ButtonWipe tone="secondary" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                    More Options
                                </span>
                            </a>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/45">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="launcher-secondary-text text-sm font-bold text-[#68d4b1]">
                                    &#10003;
                                </span>
                                Free and open source
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="launcher-secondary-text text-sm font-bold text-[#68d4b1]">
                                    &#10003;
                                </span>
                                Windows, macOS, Linux
                            </span>
                        </div>
                    </div>

                    <div className="relative mx-auto flex w-full max-w-[820px] items-center justify-center">
                        <div className="relative left-1/2 w-[106%] max-w-none -translate-x-1/2 sm:w-[108%]">
                            <img
                                key={`${themeId}-hero`}
                                src={assets.images.play}
                                alt="Brassworks Launcher play screen"
                                className="launcher-motion block h-auto w-full rounded-[8px] object-contain object-center animate-[launcher-window-in_900ms_cubic-bezier(0.22,1,0.36,1)_both]"
                                decoding="async"
                                fetchPriority="high"
                            />
                            <div className="launcher-tertiary launcher-motion absolute bottom-[4%] left-[8%] rounded-lg bg-[#a99af2] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#171614] animate-[launcher-badge-in_1000ms_180ms_cubic-bezier(0.22,1,0.36,1)_both]">
                                Ready when you are
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
