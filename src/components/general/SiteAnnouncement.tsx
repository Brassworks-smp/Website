import { Megaphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSiteAnnouncement } from "../../features/announcement/use-site-announcement";
import { ButtonWipe } from "./ButtonWipe";

const DISMISSED_ANNOUNCEMENT_KEY = "brassworks:dismissed-announcement";
const EXIT_TRANSITION = 520;

function getDismissedAnnouncement(): string | null {
    try {
        return window.localStorage.getItem(DISMISSED_ANNOUNCEMENT_KEY);
    } catch {
        return null;
    }
}

function storeDismissedAnnouncement(version: string) {
    try {
        window.localStorage.setItem(DISMISSED_ANNOUNCEMENT_KEY, version);
    } catch {
        return;
    }
}

export function SiteAnnouncement() {
    const { data: announcement } = useSiteAnnouncement();
    const [rendered, setRendered] = useState(false);
    const [open, setOpen] = useState(false);
    const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const announcementVersion = announcement?.version;

    useEffect(() => {
        if (exitTimer.current) {
            clearTimeout(exitTimer.current);
            exitTimer.current = null;
        }

        if (!announcementVersion) {
            setOpen(false);
            setRendered(false);
            return;
        }

        if (getDismissedAnnouncement() === announcementVersion) {
            setOpen(false);
            setRendered(false);
            return;
        }

        setRendered(true);
        const frame = window.requestAnimationFrame(() => setOpen(true));

        return () => window.cancelAnimationFrame(frame);
    }, [announcementVersion]);

    useEffect(() => {
        return () => {
            if (exitTimer.current) clearTimeout(exitTimer.current);
        };
    }, []);

    if (!announcement || !rendered) return null;

    const dismiss = () => {
        storeDismissedAnnouncement(announcement.version);

        setOpen(false);
        exitTimer.current = setTimeout(
            () => setRendered(false),
            EXIT_TRANSITION,
        );
    };

    return (
        <aside
            role="status"
            aria-live="polite"
            className="site-announcement-motion fixed inset-x-0 top-[72px] z-[70] px-3 sm:px-6 lg:px-[60px]"
            data-open={open}
        >
            <div className="relative isolate mx-auto flex max-w-[1600px] items-center gap-4 overflow-hidden rounded-xl bg-[#211f1b] px-4 py-4 sm:gap-5 sm:px-5">
                {announcement.background ? (
                    <>
                        <img
                            src={announcement.background}
                            alt=""
                            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
                            draggable="false"
                            decoding="async"
                        />
                        <span className="absolute inset-0 -z-10 bg-black/48" />
                    </>
                ) : null}

                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#c7a35a] text-[#171614] sm:flex">
                    <Megaphone size={21} strokeWidth={2.2} />
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="font-minecraft text-sm font-bold leading-5 text-white sm:text-base">
                        {announcement.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/65 sm:text-sm">
                        {announcement.description}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {announcement.actionLabel && announcement.actionUrl ? (
                        <a
                            href={announcement.actionUrl}
                            onClick={dismiss}
                            target={
                                announcement.actionUrl.startsWith("http")
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                announcement.actionUrl.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            className="group/button relative inline-flex min-h-10 max-w-[118px] items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[#171614] sm:max-w-none sm:px-5"
                        >
                            <ButtonWipe color="#dec17c" />
                            <span className="relative z-10 truncate">
                                {announcement.actionLabel}
                            </span>
                        </a>
                    ) : null}
                    <button
                        type="button"
                        onClick={dismiss}
                        aria-label="Close announcement"
                        className="site-accent-hover cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-white/6 text-white/65 transition-colors duration-300 hover:bg-white/10 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
