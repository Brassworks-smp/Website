import { Code2 } from "lucide-react";
import type { LauncherThemeAssets } from "../../features/launcher-assets/launcher-assets.service";
import { ButtonWipe } from "../general/ButtonWipe";
import { CROWDIN_URL, SOURCE_URL } from "./launcher-config";

type LauncherClosingSectionProps = {
    assets: LauncherThemeAssets;
};

export function LauncherClosingSection({
    assets,
}: LauncherClosingSectionProps) {
    return (
        <section className="px-3 pb-10 sm:px-6 sm:pb-14 lg:px-[60px] lg:pb-16">
            <div className="launcher-surface-strong outer relative isolate mx-auto min-h-[360px] max-w-[1600px] overflow-hidden bg-[#211f1b] sm:min-h-[400px]">
                <img
                    key={assets.closingBg}
                    src={assets.closingBg}
                    alt=""
                    className="launcher-motion absolute -inset-[2px] -z-20 h-[calc(100%+4px)] w-[calc(100%+4px)] object-cover object-center opacity-50 animate-[launcher-background-in_700ms_ease-out_both]"
                    loading="lazy"
                    decoding="async"
                />
                <div className="launcher-closing-mask absolute -inset-[2px] -z-10" />

                <div className="relative z-10 mx-auto flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center px-7 py-16 text-center sm:min-h-[400px] sm:px-12">
                    <span className="launcher-accent-text font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                        Built in the Open
                    </span>
                    <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                        Open launcher. Open development.
                    </h2>
                    <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/66 sm:text-base">
                        Read the code, report an issue, improve a translation,
                        or help shape what Brassworks Launcher becomes next.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href={SOURCE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="launcher-primary group/button relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">View Source</span>
                            <Code2
                                className="relative z-10 h-4 w-4"
                                strokeWidth={2}
                            />
                        </a>
                        <a
                            href={CROWDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="launcher-deep group/button relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#171614] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
                        >
                            <ButtonWipe tone="secondary" />
                            <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                Help Translate
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
