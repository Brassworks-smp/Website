import { SiReddit, SiX } from "@icons-pack/react-simple-icons";
import { Check, ChevronDown, Link, Mail } from "lucide-react";
import {
    type MouseEvent,
    type RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ArticleBody } from "./ArticleBody";
import { ArticleRating } from "./ArticleRating";

type ArticleHeading = {
    id: string;
    label: string;
    level: 2 | 3 | 4;
};

type PreparedArticle = {
    content: string;
    headings: ArticleHeading[];
};

const HEADING_ACTIVATION_OFFSET = 110;
const MAX_SCROLLSPY_ACTIVATION_Y = 260;
const SCROLLSPY_VIEWPORT_RATIO = 0.3;

const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
};

function decodeHtml(value: string) {
    return value
        .replace(/<[^>]*>/g, " ")
        .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
            String.fromCodePoint(Number.parseInt(code, 16)),
        )
        .replace(/&#(\d+);/g, (_, code: string) =>
            String.fromCodePoint(Number.parseInt(code, 10)),
        )
        .replace(
            /&([a-z]+);/gi,
            (entity, name: string) =>
                namedEntities[name.toLowerCase()] ?? entity,
        )
        .replace(/\s+/g, " ")
        .trim();
}

function createHeadingId(value: string) {
    return (
        value
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "section"
    );
}

function prepareArticle(content: string): PreparedArticle {
    const headings: ArticleHeading[] = [];
    const occurrences = new Map<string, number>();
    const headingPattern = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi;

    const preparedContent = content.replace(
        headingPattern,
        (_, rawLevel: string, rawAttributes: string, innerHtml: string) => {
            const label = decodeHtml(innerHtml);
            const baseId = createHeadingId(label);
            const occurrence = occurrences.get(baseId) ?? 0;
            const id =
                occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`;
            const level = Number(rawLevel) as ArticleHeading["level"];
            const attributes = rawAttributes.replace(
                /\s+id=(?:"[^"]*"|'[^']*')/gi,
                "",
            );

            occurrences.set(baseId, occurrence + 1);
            headings.push({ id, label, level });

            return `<h${rawLevel}${attributes} id="${id}">${innerHtml}</h${rawLevel}>`;
        },
    );

    return { content: preparedContent, headings };
}

function getPageScrollTop() {
    return Math.max(
        window.scrollY,
        document.scrollingElement?.scrollTop ?? 0,
        document.documentElement.scrollTop,
        document.body.scrollTop,
    );
}

function getElementDocumentTop(target: HTMLElement) {
    let top = 0;
    let current: HTMLElement | null = target;

    while (current) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
    }

    return top;
}

function getNestedScrollOffset(target: HTMLElement) {
    let offset = 0;
    let parent = target.parentElement;

    while (
        parent &&
        parent !== document.body &&
        parent !== document.documentElement
    ) {
        offset += parent.scrollTop;
        parent = parent.parentElement;
    }

    return offset;
}

function getHeadingViewportTop(target: HTMLElement) {
    return (
        getElementDocumentTop(target) -
        getPageScrollTop() -
        getNestedScrollOffset(target)
    );
}

function scrollToHeading(target: HTMLElement) {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const scrollingElement = document.scrollingElement;
    const currentScrollTop = getPageScrollTop();
    const targetTop = target.getBoundingClientRect().top + currentScrollTop;
    const maxScrollTop = Math.max(
        0,
        (scrollingElement?.scrollHeight ??
            document.documentElement.scrollHeight) - window.innerHeight,
    );
    const top = Math.min(
        maxScrollTop,
        Math.max(0, targetTop - HEADING_ACTIVATION_OFFSET),
    );

    window.scrollTo({ top, behavior });
}

function getScrollspyActivationY() {
    return Math.min(
        MAX_SCROLLSPY_ACTIVATION_Y,
        Math.max(
            HEADING_ACTIVATION_OFFSET,
            window.innerHeight * SCROLLSPY_VIEWPORT_RATIO,
        ),
    );
}

function useActiveHeading(
    headings: ArticleHeading[],
    articleRootRef: RefObject<HTMLDivElement | null>,
) {
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

    useEffect(() => {
        const articleRoot = articleRootRef.current;

        if (!articleRoot) {
            setActiveId("");
            return;
        }

        const getTarget = (headingId: string) =>
            articleRoot.querySelector<HTMLElement>(`#${CSS.escape(headingId)}`);

        const getTargets = () =>
            headings
                .map((heading) => getTarget(heading.id))
                .filter((target): target is HTMLElement => target !== null);

        const initialTargets = getTargets();

        if (initialTargets.length === 0) {
            setActiveId("");
            return;
        }

        let animationFrame = 0;
        let geometryFrame = 0;
        let disposed = false;
        let lastTrackedHeadingTop = Number.NaN;

        const updateActiveHeading = () => {
            animationFrame = 0;
            const activationY = getScrollspyActivationY();

            const renderedTargets = getTargets().filter(
                (target) => target.getClientRects().length > 0,
            );

            if (renderedTargets.length === 0) {
                return;
            }

            let closestPassedTarget: HTMLElement | null = null;
            let closestPassedTop = Number.NEGATIVE_INFINITY;
            let closestUpcomingTarget: HTMLElement | null = null;
            let closestUpcomingTop = Number.POSITIVE_INFINITY;

            for (const target of renderedTargets) {
                const targetTop = getHeadingViewportTop(target);

                if (targetTop <= activationY && targetTop > closestPassedTop) {
                    closestPassedTarget = target;
                    closestPassedTop = targetTop;
                }

                if (targetTop > activationY && targetTop < closestUpcomingTop) {
                    closestUpcomingTarget = target;
                    closestUpcomingTop = targetTop;
                }
            }

            const scrollingElement = document.scrollingElement;
            const maxScrollTop = Math.max(
                0,
                (scrollingElement?.scrollHeight ??
                    document.documentElement.scrollHeight) - window.innerHeight,
            );
            const atPageEnd = maxScrollTop - getPageScrollTop() <= 2;
            const nextTarget = atPageEnd
                ? renderedTargets[renderedTargets.length - 1]
                : (closestPassedTarget ??
                  closestUpcomingTarget ??
                  renderedTargets[0]);
            const nextActiveId = nextTarget.id;

            setActiveId((current) =>
                current === nextActiveId ? current : nextActiveId,
            );
        };

        const scheduleUpdate = () => {
            if (animationFrame || disposed) {
                return;
            }

            animationFrame = window.requestAnimationFrame(updateActiveHeading);
        };

        const handleCapturedScroll = (event: Event) => {
            const scrollTarget = event.target;

            if (
                scrollTarget === document ||
                (scrollTarget instanceof Element &&
                    scrollTarget.contains(articleRoot))
            ) {
                scheduleUpdate();
            }
        };

        const watchHeadingPosition = () => {
            if (disposed) {
                return;
            }

            const trackedTarget = getTarget(headings[0].id);

            if (!trackedTarget) {
                geometryFrame =
                    window.requestAnimationFrame(watchHeadingPosition);
                return;
            }

            const headingTop =
                Math.round(getHeadingViewportTop(trackedTarget) * 2) / 2;

            if (headingTop !== lastTrackedHeadingTop) {
                lastTrackedHeadingTop = headingTop;
                scheduleUpdate();
            }

            geometryFrame = window.requestAnimationFrame(watchHeadingPosition);
        };

        setActiveId(initialTargets[0].id);
        updateActiveHeading();

        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        document.addEventListener("scroll", handleCapturedScroll, {
            capture: true,
            passive: true,
        });
        window.addEventListener("resize", scheduleUpdate);

        const resizeObserver = new ResizeObserver(scheduleUpdate);
        resizeObserver.observe(articleRoot);

        geometryFrame = window.requestAnimationFrame(watchHeadingPosition);

        void document.fonts?.ready.then(scheduleUpdate);

        return () => {
            disposed = true;
            window.cancelAnimationFrame(animationFrame);
            window.cancelAnimationFrame(geometryFrame);
            window.removeEventListener("scroll", scheduleUpdate);
            document.removeEventListener("scroll", handleCapturedScroll, true);
            window.removeEventListener("resize", scheduleUpdate);
            resizeObserver.disconnect();
        };
    }, [articleRootRef, headings]);

    return activeId;
}

function TableOfContents({
    headings,
    activeId,
    showTitle = true,
    onNavigate,
}: {
    headings: ArticleHeading[];
    activeId: string;
    showTitle?: boolean;
    onNavigate: (headingId: string) => void;
}) {
    const handleClick =
        (headingId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            onNavigate(headingId);
        };

    return (
        <nav aria-label="Article contents">
            {showTitle ? (
                <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9b86e]">
                    On this page
                </span>
            ) : null}

            <ol
                className={`${showTitle ? "mt-4" : "mt-1"} border-l border-white/10`}
            >
                {headings.map((heading) => {
                    const active = heading.id === activeId;

                    return (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={handleClick(heading.id)}
                                aria-current={active ? "location" : undefined}
                                className={`site-interactive -ml-px block border-l py-2 text-sm leading-5 transition-[border-color,color,transform] ${
                                    heading.level === 2
                                        ? "pl-4 font-semibold"
                                        : heading.level === 3
                                          ? "pl-7 text-[13px]"
                                          : "pl-10 text-xs"
                                } ${
                                    active
                                        ? "translate-x-0.5 border-[#d9b86e] text-white"
                                        : "border-transparent text-white/42 hover:border-white/20 hover:text-white/72"
                                }`}
                            >
                                {heading.label}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function ShareButtons({ title, url }: { title: string; url: string }) {
    const [copied, setCopied] = useState(false);
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const links = [
        {
            label: "Share on X",
            href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`,
            icon: SiX,
        },
        {
            label: "Share on Reddit",
            href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
            icon: SiReddit,
        },
        {
            label: "Share by email",
            href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            icon: Mail,
        },
    ];

    useEffect(() => {
        if (!copied) {
            return;
        }

        const timer = window.setTimeout(() => setCopied(false), 1800);

        return () => window.clearTimeout(timer);
    }, [copied]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div>
            <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9b86e]">
                Share
            </span>

            <div className="mt-3 flex gap-2 xl:grid xl:grid-cols-4">
                {links.map(({ label, href, icon: Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="site-icon-button flex h-10 w-10 items-center justify-center rounded-lg bg-[#211f1b] text-white/52 hover:bg-[#c7a35a] hover:text-[#171614] xl:w-full"
                    >
                        <Icon size={17} color="currentColor" />
                    </a>
                ))}

                <button
                    type="button"
                    onClick={copyLink}
                    aria-label={copied ? "Link copied" : "Copy article link"}
                    title={copied ? "Link copied" : "Copy link"}
                    className="site-icon-button flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#211f1b] text-white/52 hover:bg-[#c7a35a] hover:text-[#171614] xl:w-full"
                >
                    {copied ? <Check size={17} /> : <Link size={17} />}
                </button>
            </div>
        </div>
    );
}

export function ArticleContent({
    articleId,
    content,
    title,
    url,
}: {
    articleId: string;
    content: string;
    title: string;
    url: string;
}) {
    const article = useMemo(() => prepareArticle(content), [content]);
    const articleRootRef = useRef<HTMLDivElement | null>(null);
    const activeId = useActiveHeading(article.headings, articleRootRef);
    const [contentsOpen, setContentsOpen] = useState(false);

    const navigateToHeading = useCallback((headingId: string) => {
        const target = articleRootRef.current?.querySelector<HTMLElement>(
            `#${CSS.escape(headingId)}`,
        );

        if (!target) {
            return;
        }

        scrollToHeading(target);
        window.history.replaceState(window.history.state, "", `#${headingId}`);
    }, []);

    return (
        <div className="mx-auto mt-12 max-w-[1200px] border-t border-white/8 pt-10 sm:mt-14 sm:pt-12">
            {article.headings.length > 0 ? (
                <div className="mb-8 border-y border-white/8 py-4 xl:hidden">
                    <button
                        type="button"
                        onClick={() => setContentsOpen((open) => !open)}
                        aria-expanded={contentsOpen}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 font-minecraft text-[11px] font-bold uppercase tracking-[0.12em] text-[#d9b86e]"
                    >
                        On this page
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                contentsOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                    </button>

                    <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            contentsOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="pt-3">
                                <TableOfContents
                                    headings={article.headings}
                                    activeId={activeId}
                                    showTitle={false}
                                    onNavigate={navigateToHeading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="mb-8 xl:hidden">
                <ShareButtons title={title} url={url} />
            </div>

            <div className="relative mx-auto max-w-[1200px] xl:grid xl:grid-cols-[minmax(0,860px)_180px] xl:items-stretch xl:gap-16">
                <div ref={articleRootRef}>
                    <ArticleBody content={article.content} />
                    <ArticleRating articleId={articleId} />
                </div>

                <aside className="hidden h-full w-[180px] xl:block xl:self-stretch">
                    <div className="sticky top-[96px] space-y-10">
                        <ShareButtons title={title} url={url} />

                        {article.headings.length > 0 ? (
                            <div className="max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
                                <TableOfContents
                                    headings={article.headings}
                                    activeId={activeId}
                                    onNavigate={navigateToHeading}
                                />
                            </div>
                        ) : null}
                    </div>
                </aside>
            </div>
        </div>
    );
}
