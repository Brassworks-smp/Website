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
                    ? "h-[60px] w-max sm:h-[62px]"
                    : "h-[54px] w-max sm:h-[56px]"
            }`}
        >
            <div
                className={`absolute -bottom-px -right-px h-[calc(100%+1px)] w-[calc(100%+1px)] rounded-tl-xl ${
                    surface === "page"
                        ? "bg-[#171614]"
                        : "bg-[#211f1b] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[#27231d] group-focus-visible:bg-[#27231d]"
                }`}
            />

            <div
                className={`relative z-10 flex h-full items-center justify-end ${
                    large ? "gap-2 px-3.5" : "gap-2 px-3"
                }`}
            >
                <img
                    src={assetUrl("/icon.png")}
                    alt=""
                    className={
                        large
                            ? "h-[34px] w-[34px] object-contain"
                            : "h-[30px] w-[30px] object-contain"
                    }
                    draggable="false"
                    decoding="async"
                />
                <span className="flex flex-col items-end whitespace-nowrap leading-none">
                    <span
                        className={`font-minecraft font-bold uppercase tracking-[0.08em] text-white ${
                            large ? "text-[11px] sm:text-xs" : "text-[10px]"
                        }`}
                    >
                        Brassworks News
                    </span>
                    <span
                        className={`mt-1 font-semibold uppercase tracking-[0.14em] text-white/42 ${
                            large ? "text-[8px]" : "text-[7px]"
                        }`}
                    >
                        From the Workshop
                    </span>
                </span>
            </div>
        </div>
    );
}
