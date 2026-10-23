import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
    MediaCollection,
    MediaVideo,
} from "../../features/media/media.service";
import { useMediaVideos } from "../../features/media/use-media-videos";
import { useMobileLayout } from "../../lib/use-mobile-layout";
import { ButtonWipe } from "./ButtonWipe";

const DIRECTOR_URL = "https://www.youtube.com/@snowy-go";
const MEDIA_LIBRARY_URL = "https://www.youtube.com/@BrassworksSMP";
const MIN_MEDIA_VIDEOS = 4;
const DISPLAY_MEDIA_VIDEOS = 8;

type VideoCardProps = {
    video: MediaVideo;
    collection: MediaCollection;
    preview?: boolean;
};

type WatchMoreButtonProps = {
    collection: MediaCollection;
    channelUrl: string;
};

type VideoCollectionProps = {
    collection: MediaCollection;
    videos: MediaVideo[];
    channelUrl: string;
    isActive: boolean;
};

function prepareVideos(videos: MediaVideo[]): MediaVideo[] {
    if (videos.length < MIN_MEDIA_VIDEOS) return [];

    return Array.from(
        { length: DISPLAY_MEDIA_VIDEOS },
        (_, index) => videos[index % videos.length]!,
    );
}

function VideoCard({ video, collection, preview = false }: VideoCardProps) {
    const isDirector = collection === "director";
    const cardClassName = `${preview ? "" : "group"} relative isolate flex min-h-[300px] overflow-hidden rounded-xl border-2 border-transparent bg-[#211f1b] outline-none transition-[border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[320px] ${
        preview
            ? ""
            : isDirector
              ? "hover:border-[#79c4ff] hover:bg-[#182a3a] focus-visible:border-[#79c4ff]"
              : "hover:border-[#d9b86e] hover:bg-[#27231d] focus-visible:border-[#d9b86e]"
    }`;
    const content = (
        <div className="flex w-full flex-1 flex-col">
            <div className="relative aspect-video overflow-hidden bg-[#0d0c0b]">
                <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="h-full w-full object-cover opacity-85 saturate-[0.88] brightness-90 transition-[opacity,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:saturate-100 group-hover:brightness-100 group-focus-visible:opacity-100 group-focus-visible:saturate-100 group-focus-visible:brightness-100"
                />
            </div>

            <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                    <span
                        className={`font-minecraft transition-[color,opacity] duration-500 ${
                            isDirector
                                ? "text-[#9ed7ff]/80 group-hover:text-[#eaf6ff] group-focus-visible:text-[#eaf6ff]"
                                : "text-[#d9b86e]/80 group-hover:text-[#dec17c] group-focus-visible:text-[#dec17c]"
                        }`}
                    >
                        {video.channel}
                    </span>
                    <span className="text-white/45 transition-colors duration-500 group-hover:text-white/70 group-focus-visible:text-white/70">
                        {video.duration}
                    </span>
                </div>

                <h3 className="mt-3 pr-14 text-base font-semibold leading-6 tracking-[-0.01em] text-white/85 transition-colors duration-500 group-hover:text-white group-focus-visible:text-white sm:text-lg">
                    {video.title}
                </h3>

                <span
                    className={`pointer-events-none absolute bottom-5 right-5 flex h-10 w-10 scale-100 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] group-active:scale-95 group-focus-visible:scale-[1.08] sm:bottom-6 sm:right-6 ${
                        isDirector
                            ? "bg-[#2f78c4] text-white group-hover:bg-[#eaf6ff] group-hover:text-[#15324d] group-focus-visible:bg-[#eaf6ff] group-focus-visible:text-[#15324d]"
                            : "bg-[#c7a35a] text-[#171614] group-hover:bg-[#dec17c] group-focus-visible:bg-[#dec17c]"
                    }`}
                >
                    <Play size={18} strokeWidth={2.4} fill="currentColor" />
                </span>
            </div>
        </div>
    );

    if (preview) {
        return (
            <article className={cardClassName} aria-hidden="true">
                {content}
            </article>
        );
    }

    return (
        <a
            href={video.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${video.title} on YouTube`}
            className={cardClassName}
        >
            {content}
        </a>
    );
}

function WatchMoreButton({ collection, channelUrl }: WatchMoreButtonProps) {
    const isDirector = collection === "director";

    return (
        <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/button absolute left-1/2 top-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
                isDirector
                    ? "bg-[#2f78c4] text-white focus-visible:outline-[#9ed7ff]"
                    : "bg-[#c7a35a] text-[#171614] focus-visible:outline-[#dec17c]"
            }`}
        >
            <ButtonWipe color={isDirector ? "#eaf6ff" : "#dec17c"} />
            <span
                className={`relative z-10 transition-colors duration-300 ${
                    isDirector ? "group-hover/button:text-[#15324d]" : ""
                }`}
            >
                Watch More
            </span>
        </a>
    );
}

function VideoCollection({
    collection,
    videos,
    channelUrl,
    isActive,
}: VideoCollectionProps) {
    return (
        <div
            id={`${collection}-videos`}
            role="tabpanel"
            aria-hidden={!isActive}
            className={`relative col-start-1 row-start-1 min-w-0 transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive
                    ? "z-10 translate-y-0 opacity-100 blur-0"
                    : "pointer-events-none z-0 translate-y-2 opacity-0 blur-[2px]"
            }`}
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {videos.slice(0, 4).map((video, index) => (
                    <VideoCard
                        key={`${collection}-main-${video.id}-${index}`}
                        video={video}
                        collection={collection}
                    />
                ))}
            </div>

            {videos.length > 4 ? (
                <div className="relative mt-4 h-[285px] overflow-hidden sm:h-[305px] lg:h-[320px]">
                    <div className="pointer-events-none relative left-1/2 grid w-[920px] -translate-x-1/2 grid-cols-4 gap-4 sm:w-[1100px] xl:left-0 xl:w-full xl:translate-x-0">
                        {videos.slice(4, 8).map((video, index) => (
                            <VideoCard
                                key={`${collection}-preview-${video.id}-${index}`}
                                video={video}
                                collection={collection}
                                preview
                            />
                        ))}
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(23,22,20,0.9)_0%,rgba(23,22,20,0.99)_34%,#171614_68%)]" />
                    <WatchMoreButton
                        collection={collection}
                        channelUrl={channelUrl}
                    />
                </div>
            ) : null}
        </div>
    );
}

function MobileMediaSection({
    collections,
    activeCollection,
    onSelect,
    videos,
}: {
    collections: MediaCollection[];
    activeCollection: MediaCollection;
    onSelect: (collection: MediaCollection) => void;
    videos: MediaVideo[];
}) {
    const isDirector = activeCollection === "director";

    return (
        <section
            id="media"
            className="bg-[#171614] px-3 pb-10 text-white sm:px-6 sm:pb-14"
        >
            <header className="max-w-xl">
                <h2 className="font-minecraft text-2xl font-bold leading-tight sm:text-3xl">
                    Our Media
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
                    Watch the latest builds, stories, and behind-the-scenes
                    moments from Brassworks and our director.
                </p>
            </header>

            <div
                className="sticky top-[60px] z-20 -mx-3 mt-2 flex gap-2 bg-[#171614]/95 px-3 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
                role="tablist"
                aria-label="Choose a video collection"
            >
                {collections.map((collection) => {
                    const selected = collection === activeCollection;
                    const director = collection === "director";

                    return (
                        <button
                            key={collection}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => onSelect(collection)}
                            className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] outline-none transition-[background-color,color] duration-500 ${
                                director
                                    ? selected
                                        ? "bg-[#2f78c4] text-white"
                                        : "bg-[#14202b] text-[#9ed7ff]"
                                    : selected
                                      ? "bg-[#c7a35a] text-[#171614]"
                                      : "bg-[#29251f] text-[#d9b86e]"
                            }`}
                        >
                            {director ? "Our Director" : "Media Library"}
                        </button>
                    );
                })}
            </div>

            <div
                key={activeCollection}
                role="tabpanel"
                className="mobile-snap-row -mx-3 mt-2 flex animate-[team-content-in_750ms_cubic-bezier(0.22,1,0.36,1)_both] scroll-px-3 gap-3 overflow-x-auto px-3 sm:-mx-6 sm:scroll-px-6 sm:px-6"
            >
                {videos.map((video) => (
                    <a
                        key={video.id}
                        href={video.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Watch ${video.title} on YouTube`}
                        className="flex w-[78%] shrink-0 flex-col overflow-hidden rounded-xl bg-[#211f1b] outline-none transition-colors duration-500 focus-visible:bg-[#27231d] active:bg-[#27231d] sm:w-[46%] md:w-[38%]"
                    >
                        <span className="relative block aspect-video overflow-hidden bg-[#0d0c0b]">
                            <img
                                src={video.thumbnail}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                draggable="false"
                                className="h-full w-full object-cover"
                            />
                            <span
                                className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg ${
                                    isDirector
                                        ? "bg-[#2f78c4] text-white"
                                        : "bg-[#c7a35a] text-[#171614]"
                                }`}
                            >
                                <Play
                                    size={16}
                                    strokeWidth={2.4}
                                    fill="currentColor"
                                />
                            </span>
                        </span>
                        <span className="block px-4 pb-4 pt-3">
                            <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.1em]">
                                <span
                                    className={`truncate font-minecraft ${
                                        isDirector
                                            ? "text-[#9ed7ff]/80"
                                            : "text-[#d9b86e]/80"
                                    }`}
                                >
                                    {video.channel}
                                </span>
                                <span className="shrink-0 text-white/45">
                                    {video.duration}
                                </span>
                            </span>
                            <span className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-white/85">
                                {video.title}
                            </span>
                        </span>
                    </a>
                ))}

                <a
                    href={isDirector ? DIRECTOR_URL : MEDIA_LIBRARY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-[46%] shrink-0 flex-col items-center justify-center gap-3 rounded-xl px-4 text-center text-xs font-bold uppercase tracking-[0.08em] sm:w-[28%] md:w-[22%] ${
                        isDirector
                            ? "bg-[#14202b] text-[#9ed7ff]"
                            : "bg-[#29251f] text-[#d9b86e]"
                    }`}
                >
                    <span
                        className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                            isDirector
                                ? "bg-[#2f78c4] text-white"
                                : "bg-[#c7a35a] text-[#171614]"
                        }`}
                    >
                        <ArrowUpRight size={20} strokeWidth={2.2} />
                    </span>
                    Watch More
                </a>
            </div>
        </section>
    );
}

export function MediaSection() {
    const mobile = useMobileLayout();
    const [activeCollection, setActiveCollection] =
        useState<MediaCollection>("director");
    const { data: cmsVideos = [], isPending, isError } = useMediaVideos();
    const directorVideos = prepareVideos(
        cmsVideos.filter((video) => video.collection === "director"),
    );
    const libraryVideos = prepareVideos(
        cmsVideos.filter((video) => video.collection === "library"),
    );
    const collections = useMemo(
        () =>
            [
                directorVideos.length > 0 ? "director" : null,
                libraryVideos.length > 0 ? "library" : null,
            ].filter((item): item is MediaCollection => item !== null),
        [directorVideos.length, libraryVideos.length],
    );

    useEffect(() => {
        if (!collections.includes(activeCollection) && collections[0]) {
            setActiveCollection(collections[0]);
        }
    }, [activeCollection, collections]);

    if (isPending || isError || collections.length === 0) return null;

    if (mobile) {
        return (
            <MobileMediaSection
                collections={collections}
                activeCollection={activeCollection}
                onSelect={setActiveCollection}
                videos={cmsVideos.filter(
                    (video) => video.collection === activeCollection,
                )}
            />
        );
    }

    return (
        <section
            id="media"
            className="bg-[#171614] px-3 pb-10 text-white sm:px-6 sm:pb-16 lg:px-[60px] lg:pb-20"
        >
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-10 flex flex-col gap-7 sm:mb-12 lg:flex-row lg:items-start lg:justify-between">
                    <header className="max-w-2xl text-left">
                        <h2 className="font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                            Our Media
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/65 sm:text-base sm:leading-7">
                            Watch the latest builds, stories, and
                            behind-the-scenes moments from Brassworks and our
                            director.
                        </p>
                    </header>

                    <div
                        className="flex flex-wrap items-center justify-start gap-2 lg:justify-end lg:pt-1"
                        role="tablist"
                        aria-label="Choose a video collection"
                    >
                        {directorVideos.length > 0 ? (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeCollection === "director"}
                                aria-controls="director-videos"
                                onClick={() => setActiveCollection("director")}
                                className={`group/button relative inline-flex min-h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] outline-none transition-[background-color,color] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9ed7ff] ${
                                    activeCollection === "director"
                                        ? "bg-[#2f78c4] text-white"
                                        : "bg-[#14202b] text-[#9ed7ff]"
                                }`}
                            >
                                <ButtonWipe color="#eaf6ff" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#15324d]">
                                    Our Director
                                </span>
                            </button>
                        ) : null}

                        {libraryVideos.length > 0 ? (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeCollection === "library"}
                                aria-controls="library-videos"
                                onClick={() => setActiveCollection("library")}
                                className={`group/button relative inline-flex min-h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] outline-none transition-[background-color,color] duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dec17c] ${
                                    activeCollection === "library"
                                        ? "bg-[#c7a35a] text-[#171614]"
                                        : "bg-[#29251f] text-[#d9b86e]"
                                }`}
                            >
                                <ButtonWipe color="#dec17c" />
                                <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                    Media Library
                                </span>
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="grid">
                    {directorVideos.length > 0 ? (
                        <VideoCollection
                            collection="director"
                            videos={directorVideos}
                            channelUrl={DIRECTOR_URL}
                            isActive={activeCollection === "director"}
                        />
                    ) : null}
                    {libraryVideos.length > 0 ? (
                        <VideoCollection
                            collection="library"
                            videos={libraryVideos}
                            channelUrl={MEDIA_LIBRARY_URL}
                            isActive={activeCollection === "library"}
                        />
                    ) : null}
                </div>
            </div>
        </section>
    );
}
