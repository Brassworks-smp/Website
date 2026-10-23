import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import type {
    RoadmapItem,
    RoadmapItemCategory,
    RoadmapItemStatus,
    RoadmapProject,
} from "../../features/roadmap/roadmap.service";

const categoryLabels: Record<RoadmapItemCategory, string> = {
    technical: "Technical",
    fix: "Fixes",
    addition: "Additions",
    update: "Updates",
};

const statusLabels: Record<RoadmapItemStatus, string> = {
    planned: "Planned",
    in_progress: "In Progress",
    testing: "Testing",
    done: "Done",
    released: "Released",
};

type RoadmapItemModalProps = {
    item: RoadmapItem;
    project: RoadmapProject;
    onClose: () => void;
};

export function RoadmapItemModal({
    item,
    project,
    onClose,
}: RoadmapItemModalProps) {
    const images = item.images ?? [];
    const contributors = item.contributors ?? [];
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const activeImage = images[activeImageIndex];

    useEffect(() => {
        setActiveImageIndex(0);
    }, [item.id]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();

            if (images.length > 1 && event.key === "ArrowLeft") {
                setActiveImageIndex((index) =>
                    index === 0 ? images.length - 1 : index - 1,
                );
            }

            if (images.length > 1 && event.key === "ArrowRight") {
                setActiveImageIndex((index) => (index + 1) % images.length);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [images.length, onClose]);

    const showPreviousImage = () => {
        setActiveImageIndex((index) =>
            index === 0 ? images.length - 1 : index - 1,
        );
    };

    const showNextImage = () => {
        setActiveImageIndex((index) => (index + 1) % images.length);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0c0b]/88 p-3 backdrop-blur-md sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="roadmap-item-modal-title"
                className="relative grid max-h-[92svh] w-full max-w-[1240px] overflow-hidden rounded-xl bg-[#171614] text-white lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#0d0c0b]/88 text-white/62 backdrop-blur-sm transition-colors duration-300 hover:bg-[#211f1b] hover:text-white"
                    aria-label="Close roadmap details"
                    autoFocus
                >
                    <X className="h-5 w-5" strokeWidth={2} />
                </button>

                {activeImage ? (
                    <div className="relative flex min-h-[300px] flex-col bg-[#0d0c0b] lg:min-h-0">
                        <div className="relative min-h-0 flex-1 overflow-hidden">
                            <img
                                key={activeImage.id}
                                src={activeImage.source}
                                alt={activeImage.alt}
                                className="h-full min-h-[300px] w-full object-contain p-6 sm:p-10 lg:min-h-0"
                                draggable="false"
                                decoding="async"
                            />

                            {images.length > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={showPreviousImage}
                                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-[#171614]/90 text-white/64 backdrop-blur-sm transition-colors duration-300 hover:text-white"
                                        aria-label="Show previous image"
                                    >
                                        <ChevronLeft
                                            className="h-5 w-5"
                                            strokeWidth={2}
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showNextImage}
                                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-[#171614]/90 text-white/64 backdrop-blur-sm transition-colors duration-300 hover:text-white"
                                        aria-label="Show next image"
                                    >
                                        <ChevronRight
                                            className="h-5 w-5"
                                            strokeWidth={2}
                                        />
                                    </button>
                                </>
                            ) : null}
                        </div>

                        {images.length > 1 ? (
                            <div className="flex gap-2 overflow-x-auto px-4 pb-4">
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveImageIndex(index)
                                        }
                                        className="h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-[#171614] transition-[border-color,opacity] duration-300"
                                        style={{
                                            borderColor:
                                                index === activeImageIndex
                                                    ? project.accent
                                                    : "transparent",
                                            opacity:
                                                index === activeImageIndex
                                                    ? 1
                                                    : 0.5,
                                        }}
                                        aria-label={`Show image ${index + 1}`}
                                        aria-pressed={
                                            index === activeImageIndex
                                        }
                                    >
                                        <img
                                            src={image.source}
                                            alt=""
                                            className="h-full w-full bg-[#0d0c0b] object-contain"
                                            draggable="false"
                                            decoding="async"
                                        />
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div
                    className={`min-h-0 overflow-y-auto p-6 sm:p-8 lg:p-10 ${
                        activeImage
                            ? ""
                            : "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-4xl"
                    }`}
                >
                    <div className="flex flex-wrap items-center gap-2 pr-12">
                        <span
                            className="rounded-md px-3 py-1.5 font-minecraft text-[10px] font-bold uppercase tracking-[0.1em]"
                            style={{
                                backgroundColor: project.accent,
                                color: project.accentText,
                            }}
                        >
                            {statusLabels[item.status]}
                        </span>
                        {item.categories.map((category) => (
                            <span
                                key={category}
                                className="rounded-md bg-[#211f1b] px-3 py-1.5 font-minecraft text-[10px] font-bold uppercase tracking-[0.1em] text-white/58"
                            >
                                {categoryLabels[category]}
                            </span>
                        ))}
                    </div>

                    <h2
                        id="roadmap-item-modal-title"
                        className="mt-6 font-minecraft text-2xl font-bold leading-tight sm:text-3xl"
                    >
                        {item.title}
                    </h2>

                    {item.description && !item.details ? (
                        <p className="mt-4 text-sm font-medium leading-7 text-white/60 sm:text-base">
                            {item.description}
                        </p>
                    ) : null}

                    {contributors.length > 0 ? (
                        <div className="mt-8">
                            <span className="text-xs font-medium text-white/38">
                                Working on this
                            </span>
                            <div className="mt-3 flex flex-wrap items-center text-sm font-semibold text-white/72">
                                {contributors.map((contributor, index) => (
                                    <Fragment key={contributor.id}>
                                        {index > 0 ? (
                                            <span className="mx-1 text-white/45">
                                                {index ===
                                                contributors.length - 1
                                                    ? contributors.length > 2
                                                        ? ", and"
                                                        : "and"
                                                    : ","}
                                            </span>
                                        ) : null}
                                        <span className="inline-flex items-center gap-1.5 text-white/82">
                                            {contributor.avatar ? (
                                                <img
                                                    src={contributor.avatar}
                                                    alt=""
                                                    className="h-6 w-6 rounded-md object-cover [image-rendering:pixelated]"
                                                    draggable="false"
                                                    decoding="async"
                                                />
                                            ) : null}
                                            <span>{contributor.name}</span>
                                        </span>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {item.details ? (
                        <div
                            className="roadmap-rich-text mt-8 text-sm font-medium leading-7 text-white/62 [&_a]:text-[#d9b86e] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-7 [&_h2]:font-minecraft [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-minecraft [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-white/86 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
                            dangerouslySetInnerHTML={{ __html: item.details }}
                        />
                    ) : null}
                </div>
            </section>
        </div>
    );
}
