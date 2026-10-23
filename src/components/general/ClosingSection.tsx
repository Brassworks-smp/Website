import { ArrowUpRight, Check, Share2 } from "lucide-react";
import { type CSSProperties, useState } from "react";
import { useHomepageAssets } from "../../features/homepage-assets/use-homepage-assets";
import {
    useHandheldDevice,
    useMobileLayout,
} from "../../lib/use-mobile-layout";
import { ButtonWipe } from "./ButtonWipe";

const DISCORD_URL = "https://discord.gg/brassworks";
const CLOSING_MASK_STYLE = {
    "--outer-radius": "clamp(18px, 1.8vw, 30px)",
    "--pillar-y": "clamp(18px, 1.8vw, 26px)",
    "--big-circle-radius": "clamp(20px, 1.8vw, 28px)",
    "--circle-radius": "clamp(20px, 1.8vw, 28px)",
} as CSSProperties;

export function ShareLauncherButton({ className }: { className: string }) {
    const [copied, setCopied] = useState(false);

    const shareLauncher = async () => {
        const url = new URL("/launcher", window.location.origin).toString();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Brassworks Launcher",
                    text: "Install the Brassworks Launcher on your PC.",
                    url,
                });
            } catch {}
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2400);
        } catch {
            window.location.href = url;
        }
    };

    return (
        <button
            type="button"
            onClick={() => void shareLauncher()}
            className={`group/button relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] ${className}`}
        >
            <ButtonWipe tone="secondary" />
            {copied ? (
                <Check className="relative z-10 h-4 w-4 transition-colors duration-300 group-hover/button:text-[#171614]" />
            ) : (
                <Share2 className="relative z-10 h-4 w-4 transition-colors duration-300 group-hover/button:text-[#171614]" />
            )}
            <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                {copied ? "Link Copied" : "Send Launcher to PC"}
            </span>
        </button>
    );
}

function MobileClosingSection({ cover }: { cover: string }) {
    const handheld = useHandheldDevice();

    return (
        <section className="bg-[#171614] px-3 pb-10 text-white sm:px-6 sm:pb-14">
            <div className="relative isolate overflow-hidden rounded-xl bg-[#171614]">
                <img
                    src={cover}
                    alt=""
                    className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
                    draggable="false"
                    decoding="async"
                />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(13,12,11,0.85),rgba(13,12,11,0.35))]" />

                <div className="flex flex-col items-center px-6 py-12 text-center sm:px-10 sm:py-14">
                    <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                        Build With Us
                    </span>
                    <h2 className="mt-3 font-minecraft text-2xl font-bold leading-tight sm:text-3xl">
                        Make It Real.
                    </h2>
                    <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-white/70">
                        Join Brassworks, explore what we are making, and help
                        shape the projects that come next.
                    </p>

                    <div className="mt-6 grid w-full max-w-sm gap-2">
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/button relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Join Now</span>
                            <ArrowUpRight className="relative z-10 h-4 w-4" />
                        </a>
                        {handheld ? (
                            <ShareLauncherButton className="bg-[#171614] text-white" />
                        ) : (
                            <a
                                href="/launcher"
                                className="group/button relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#171614] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
                            >
                                <ButtonWipe tone="secondary" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                    Get the Launcher
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ClosingSection() {
    const { data: homepageAssets } = useHomepageAssets();
    const mobile = useMobileLayout();

    if (!homepageAssets?.modsCover) return null;

    if (mobile)
        return <MobileClosingSection cover={homepageAssets.modsCover} />;

    return (
        <section className="bg-[#171614] px-3 pb-10 text-white sm:px-6 sm:pb-14 lg:px-[60px] lg:pb-16">
            <div
                className="outer relative isolate mx-auto min-h-[360px] max-w-[1600px] overflow-hidden bg-[#171614] sm:min-h-[400px]"
                style={CLOSING_MASK_STYLE}
            >
                <img
                    src={homepageAssets.modsCover}
                    alt=""
                    className="absolute -inset-[2px] -z-20 h-[calc(100%+4px)] w-[calc(100%+4px)] object-cover opacity-70"
                    draggable="false"
                    decoding="async"
                />
                <div className="absolute -inset-[2px] -z-10 bg-[linear-gradient(90deg,rgba(13,12,11,0.28)_0%,rgba(13,12,11,0)_42%,rgba(13,12,11,0)_58%,rgba(13,12,11,0.24)_100%)]" />

                <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center px-7 py-16 text-center sm:min-h-[400px] sm:px-12">
                    <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                        Build With Us
                    </span>
                    <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                        Make It Real.
                    </h2>
                    <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/70 sm:text-base">
                        Join Brassworks, explore what we are making, and help
                        shape the projects that come next.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/button relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Join Now</span>
                            <ArrowUpRight className="relative z-10 h-4 w-4" />
                        </a>
                        <a
                            href="/launcher"
                            className="group/button relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#171614] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
                        >
                            <ButtonWipe tone="secondary" />
                            <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                Get the Launcher
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
