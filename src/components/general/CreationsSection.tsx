import { LockKeyhole } from "lucide-react";
import { type FocusEvent, useEffect, useRef } from "react";
import { useHomepageAssets } from "../../features/homepage-assets/use-homepage-assets";
import { useMobileLayout } from "../../lib/use-mobile-layout";
import { ButtonWipe } from "./ButtonWipe";

const PREVIEW_TRANSITION = 500;
const PROJECTS_URL = "https://modrinth.com/organization/brassworks";

type Creation = {
    id: string;
    title: string;
    description: string;
    status: "live" | "development";
    theme: "brass" | "blue";
    tag: string;
    cover: string;
    logo: string | null;
    video: string | null;
    href: string | null;
    primaryLabel: string;
    primaryUrl: string | null;
    secondaryLabel: string | null;
    secondaryUrl: string | null;
};

function ActionButton({
    href,
    label,
    primary,
    blue,
}: {
    href: string;
    label: string;
    primary: boolean;
    blue: boolean;
}) {
    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`group/button pointer-events-auto relative z-20 inline-flex min-h-10 items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] [text-shadow:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                blue
                    ? primary
                        ? "bg-[#2f78c4] text-white focus-visible:outline-[#9ed7ff]"
                        : "bg-[#14202b] text-[#eaf6ff] focus-visible:outline-[#9ed7ff]"
                    : primary
                      ? "bg-[#c7a35a] text-[#171614] focus-visible:outline-[#dec17c]"
                      : "bg-[#211f1b] text-white focus-visible:outline-[#dec17c]"
            }`}
        >
            <ButtonWipe
                color={blue ? "#eaf6ff" : primary ? "#dec17c" : "#d9b86e"}
            />
            <span
                className={`relative z-10 transition-colors duration-300 ${
                    blue
                        ? "group-hover/button:text-[#15324d]"
                        : !primary
                          ? "group-hover/button:text-[#171614]"
                          : ""
                }`}
            >
                {label}
            </span>
        </a>
    );
}

function CreationCard({ creation }: { creation: Creation }) {
    const previewRef = useRef<HTMLVideoElement | null>(null);
    const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isBlue = creation.theme === "blue";

    const startPreview = () => {
        if (!creation.video) return;

        if (stopTimer.current) {
            clearTimeout(stopTimer.current);
            stopTimer.current = null;
        }

        void previewRef.current?.play().catch(() => {});
    };

    const stopPreview = () => {
        if (!creation.video) return;

        if (stopTimer.current) clearTimeout(stopTimer.current);

        stopTimer.current = setTimeout(() => {
            previewRef.current?.pause();
        }, PREVIEW_TRANSITION);
    };

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
        const nextTarget = event.relatedTarget;

        if (
            nextTarget instanceof Node &&
            event.currentTarget.contains(nextTarget)
        ) {
            return;
        }

        stopPreview();
    };

    useEffect(() => {
        return () => {
            if (stopTimer.current) clearTimeout(stopTimer.current);
            previewRef.current?.pause();
        };
    }, []);

    return (
        <article
            className={`group relative isolate block min-h-[450px] cursor-pointer overflow-hidden rounded-xl border-2 border-transparent outline-none transition-[border-color,background-color] duration-500 ease-out sm:min-h-[490px] ${
                isBlue
                    ? "bg-[#14202b] hover:border-[#79c4ff] focus-within:border-[#79c4ff]"
                    : "bg-[#211f1b] hover:border-[#d9b86e] focus-within:border-[#d9b86e]"
            }`}
            onMouseEnter={startPreview}
            onMouseLeave={stopPreview}
            onFocus={startPreview}
            onBlur={handleBlur}
        >
            <img
                src={creation.cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                draggable="false"
                decoding="async"
            />

            {creation.video ? (
                <video
                    ref={previewRef}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                >
                    <source src={creation.video} type="video/mp4" />
                </video>
            ) : null}

            {creation.href ? (
                <a
                    href={creation.href}
                    target={
                        creation.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                        creation.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                    }
                    className="absolute inset-0 z-[5] outline-none"
                    aria-label={`Open ${creation.title}`}
                />
            ) : null}

            <span
                className={`pointer-events-none absolute left-5 top-5 z-20 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] sm:left-6 sm:top-6 ${
                    isBlue
                        ? "bg-[#2f78c4] text-white"
                        : "bg-[#c7a35a] text-[#171614]"
                }`}
            >
                {creation.tag}
            </span>

            <div className="pointer-events-none absolute inset-x-6 bottom-7 z-10 text-center [text-shadow:0_2px_8px_rgba(0,0,0,0.65)] sm:inset-x-10 sm:bottom-9">
                {creation.logo ? (
                    <img
                        src={creation.logo}
                        alt={creation.title}
                        className="mx-auto h-auto w-[min(470px,90%)] -translate-y-10 select-none object-contain [image-rendering:pixelated]"
                        draggable="false"
                        decoding="async"
                    />
                ) : creation.status === "development" ? (
                    <LockKeyhole
                        className="mx-auto mb-16 h-14 w-14 text-[#eaf6ff]"
                        strokeWidth={1.4}
                    />
                ) : (
                    <h3 className="mb-7 font-minecraft text-2xl font-bold text-white sm:text-3xl">
                        {creation.title}
                    </h3>
                )}

                <p className="mx-auto max-w-xl text-sm font-semibold leading-6 text-white/90 sm:text-[15px]">
                    {creation.description}
                </p>

                <div className="pointer-events-auto relative z-20 mt-5 flex flex-wrap items-center justify-center gap-3">
                    {creation.primaryUrl ? (
                        <ActionButton
                            href={creation.primaryUrl}
                            label={creation.primaryLabel}
                            primary
                            blue={isBlue}
                        />
                    ) : (
                        <span
                            aria-disabled="true"
                            className="group/button relative inline-flex min-h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#2f78c4] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white [text-shadow:none]"
                        >
                            <ButtonWipe color="#eaf6ff" />
                            <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#15324d]">
                                {creation.primaryLabel}
                            </span>
                        </span>
                    )}
                    {creation.secondaryLabel && creation.secondaryUrl ? (
                        <ActionButton
                            href={creation.secondaryUrl}
                            label={creation.secondaryLabel}
                            primary={false}
                            blue={isBlue}
                        />
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function MobileCreationCard({ creation }: { creation: Creation }) {
    const isBlue = creation.theme === "blue";

    return (
        <article
            className={`relative isolate flex min-h-[380px] flex-col justify-center overflow-hidden rounded-xl pb-6 pt-16 sm:min-h-[420px] ${
                isBlue ? "bg-[#14202b]" : "bg-[#211f1b]"
            }`}
        >
            <img
                src={creation.cover}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover"
                draggable="false"
                decoding="async"
            />
            <span
                className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(10,9,8,0.72),rgba(10,9,8,0.38)_70%,rgba(10,9,8,0.2))]"
                aria-hidden="true"
            />

            {creation.href ? (
                <a
                    href={creation.href}
                    target={
                        creation.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                        creation.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                    }
                    className="absolute inset-0 z-[5] outline-none"
                    aria-label={`Open ${creation.title}`}
                />
            ) : null}

            <span
                className={`pointer-events-none absolute left-4 top-4 z-20 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                    isBlue
                        ? "bg-[#2f78c4] text-white"
                        : "bg-[#c7a35a] text-[#171614]"
                }`}
            >
                {creation.tag}
            </span>

            <div className="pointer-events-none relative z-10 px-5 text-center [text-shadow:0_2px_8px_rgba(0,0,0,0.65)]">
                {creation.logo ? (
                    <img
                        src={creation.logo}
                        alt={creation.title}
                        className="mx-auto mb-4 h-auto w-[min(320px,86%)] select-none object-contain [image-rendering:pixelated]"
                        draggable="false"
                        decoding="async"
                    />
                ) : creation.status === "development" ? (
                    <LockKeyhole
                        className="mx-auto mb-6 h-12 w-12 text-[#eaf6ff]"
                        strokeWidth={1.4}
                    />
                ) : (
                    <h3 className="mb-4 font-minecraft text-2xl font-bold text-white">
                        {creation.title}
                    </h3>
                )}

                <p className="mx-auto max-w-md text-sm font-semibold leading-6 text-white/90">
                    {creation.description}
                </p>

                <div className="pointer-events-auto relative z-20 mt-4 flex flex-wrap items-center justify-center gap-2">
                    {creation.primaryUrl ? (
                        <ActionButton
                            href={creation.primaryUrl}
                            label={creation.primaryLabel}
                            primary
                            blue={isBlue}
                        />
                    ) : (
                        <span
                            aria-disabled="true"
                            className="relative inline-flex min-h-10 items-center justify-center overflow-hidden rounded-lg bg-[#2f78c4] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white [text-shadow:none]"
                        >
                            {creation.primaryLabel}
                        </span>
                    )}
                    {creation.secondaryLabel && creation.secondaryUrl ? (
                        <ActionButton
                            href={creation.secondaryUrl}
                            label={creation.secondaryLabel}
                            primary={false}
                            blue={isBlue}
                        />
                    ) : null}
                </div>
            </div>
        </article>
    );
}

function MobileCreationsSection({ creations }: { creations: Creation[] }) {
    return (
        <section
            id="creations"
            className="bg-[#171614] px-3 pb-10 pt-6 text-white sm:px-6 sm:pb-14"
        >
            <header className="mb-5 max-w-xl">
                <h2 className="font-minecraft text-2xl font-bold leading-tight sm:text-3xl">
                    Our Creations
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
                    Handcrafted modpacks, ready when you are - with installs and
                    updates made simple through our{" "}
                    <a
                        href="/launcher"
                        className="text-[#d9b86e] underline decoration-[#d9b86e]/45 underline-offset-4 transition-colors hover:text-[#dec17c]"
                    >
                        launcher
                    </a>
                    .
                </p>
            </header>

            <div className="grid gap-3">
                {creations.map((creation) => (
                    <MobileCreationCard key={creation.id} creation={creation} />
                ))}
            </div>

            <a
                href={PROJECTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/button relative mt-4 inline-flex min-h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dec17c] sm:w-fit"
            >
                <ButtonWipe />
                <span className="relative z-10">Explore All Projects</span>
            </a>
        </section>
    );
}

export function CreationsSection() {
    const { data: homepageAssets } = useHomepageAssets();
    const mobile = useMobileLayout();

    const creations: Creation[] = [];

    if (homepageAssets?.modpackCover && homepageAssets.modpackLogo) {
        creations.push({
            id: "brassworks",
            title: "Create: Brassworks",
            description:
                "Build ambitious factories, explore a shared world, and shape an evolving Create experience together.",
            status: "live",
            theme: "brass",
            tag: "Play Now",
            cover: homepageAssets.modpackCover,
            logo: homepageAssets.modpackLogo,
            video: homepageAssets.modpackVideo,
            href: "https://modrinth.com/server/brassworks-smp-official-server",
            primaryLabel: "Play Now",
            primaryUrl:
                "https://modrinth.com/server/brassworks-smp-official-server",
            secondaryLabel: "Learn More",
            secondaryUrl:
                "https://modrinth.com/server/brassworks-smp-official-server",
        });
    }

    if (homepageAssets?.modpack2Cover) {
        creations.push({
            id: "upcoming",
            title: "Upcoming Project",
            description:
                "Something new is taking shape behind closed doors. More will be revealed when it is ready.",
            status: "development",
            theme: "blue",
            tag: "In Development",
            cover: homepageAssets.modpack2Cover,
            logo: null,
            video: null,
            href: null,
            primaryLabel: "Stay Tuned",
            primaryUrl: null,
            secondaryLabel: null,
            secondaryUrl: null,
        });
    }

    if (creations.length === 0) return null;

    if (mobile) return <MobileCreationsSection creations={creations} />;

    return (
        <section
            id="creations"
            className="bg-[#171614] px-4 pb-16 text-white sm:px-8 lg:px-[60px]"
        >
            <div className="mx-auto max-w-[1600px]">
                <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
                    <h2 className="font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                        Our Creations
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/65 sm:text-base sm:leading-7">
                        Handcrafted modpacks, ready when you are - with installs
                        and updates made simple through our{" "}
                        <a
                            href="/launcher"
                            className="text-[#d9b86e] underline decoration-[#d9b86e]/45 underline-offset-4 transition-colors hover:text-[#dec17c]"
                        >
                            launcher
                        </a>
                        .
                    </p>
                </header>

                <div className="grid gap-5 lg:grid-cols-2">
                    {creations.map((creation) => (
                        <CreationCard key={creation.id} creation={creation} />
                    ))}
                </div>
            </div>
        </section>
    );
}
