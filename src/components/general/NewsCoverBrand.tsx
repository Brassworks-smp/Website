import { assetUrl } from "../../lib/assets.js";

export function NewsCoverBrand({
    large = false,
    surface = "card",
}: {
    large?: boolean;
    surface?: "card" | "page";
}) {
    return (
        <div
            className={`pointer-events-none absolute bottom-0 right-0 ${
                large
                    ? "h-[64px] w-[min(72%,290px)] sm:h-[68px] sm:w-[310px]"
                    : "h-[52px] w-[min(76%,220px)] sm:h-[56px] sm:w-[235px]"
            }`}
        >
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 310 68"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    className={
                        surface === "page"
                            ? "fill-[#171614]"
                            : "fill-[#211f1b] transition-colors duration-700 group-hover:fill-[#27231d] group-focus-visible:fill-[#27231d]"
                    }
                    d="M 28 0 H 310 V 68 H 0 V 28 Q 0 0 28 0 Z"
                />
            </svg>

            <div
                className={`relative z-10 flex h-full items-center justify-end ${
                    large
                        ? "gap-2.5 px-5 pt-0.5"
                        : "gap-2 px-3.5 pt-0.5 sm:px-4"
                }`}
            >
                <img
                    src={assetUrl("/icon.png")}
                    alt=""
                    className={
                        large
                            ? "h-8 w-8 object-contain"
                            : "h-7 w-7 object-contain"
                    }
                    draggable="false"
                    decoding="async"
                />
                <span className="flex flex-col items-end leading-none">
                    <span
                        className={`font-minecraft font-bold uppercase tracking-[0.08em] text-white ${
                            large
                                ? "text-[11px] sm:text-xs"
                                : "text-[9px] sm:text-[10px]"
                        }`}
                    >
                        Brassworks News
                    </span>
                    <span
                        className={`mt-1 font-semibold uppercase tracking-[0.14em] text-white/42 ${
                            large ? "text-[8px]" : "text-[6px] sm:text-[7px]"
                        }`}
                    >
                        From the Workshop
                    </span>
                </span>
            </div>
        </div>
    );
}
