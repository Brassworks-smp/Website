import {
    Braces,
    Bug,
    Check,
    ChevronDown,
    Circle,
    FlaskConical,
    LoaderCircle,
    type LucideIcon,
    Rocket,
    Search,
    Sparkles,
    Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
    RoadmapItem,
    RoadmapItemCategory,
    RoadmapItemStatus,
    RoadmapProject,
} from "../../features/roadmap/roadmap.service";
import { RoadmapItemModal } from "./RoadmapItemModal";

const categoryConfig: Record<
    RoadmapItemCategory,
    { label: string; icon: LucideIcon }
> = {
    technical: { label: "Technical", icon: Braces },
    fix: { label: "Fixes", icon: Bug },
    addition: { label: "Additions", icon: Sparkles },
    update: { label: "Updates", icon: Wrench },
};

const statusColumns: Array<{
    id: Exclude<RoadmapItemStatus, "released">;
    label: string;
    icon: LucideIcon;
}> = [
    { id: "planned", label: "Planned", icon: Circle },
    { id: "in_progress", label: "In Progress", icon: LoaderCircle },
    { id: "testing", label: "Testing & Review", icon: FlaskConical },
    { id: "done", label: "Done", icon: Check },
];

type RoadmapItemCardProps = {
    item: RoadmapItem;
    accent: string;
    onSelect: () => void;
};

function RoadmapItemCard({ item, accent, onSelect }: RoadmapItemCardProps) {
    const previewImage = item.images?.[0];

    return (
        <button
            type="button"
            onClick={onSelect}
            className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-white/6 bg-[#171614] text-left outline-none transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/12 hover:bg-[#211f1b] focus-visible:border-white/20"
            aria-label={`Open details for ${item.title}`}
        >
            {previewImage ? (
                <img
                    src={previewImage.source}
                    alt=""
                    className="aspect-video w-full bg-[#0d0c0b] object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    draggable="false"
                    decoding="async"
                />
            ) : null}

            <span className="flex w-full flex-1 flex-col p-4">
                {item.categories.length > 0 ? (
                    <span className="flex flex-wrap gap-1.5">
                        {item.categories.map((categoryId) => {
                            const category = categoryConfig[categoryId];
                            const CategoryIcon = category.icon;

                            return (
                                <span
                                    key={categoryId}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-white/6 px-2 py-1 font-minecraft text-[9px] font-bold uppercase tracking-[0.07em] text-white/46"
                                >
                                    <CategoryIcon
                                        className="h-3 w-3"
                                        style={{ color: accent }}
                                        strokeWidth={2}
                                    />
                                    {category.label}
                                </span>
                            );
                        })}
                    </span>
                ) : null}
                <span className="mt-3 block text-sm font-semibold leading-5 text-white/88">
                    {item.title}
                </span>
                {item.description ? (
                    <span className="mt-2 line-clamp-3 block text-xs font-medium leading-5 text-white/46">
                        {item.description}
                    </span>
                ) : null}
            </span>
        </button>
    );
}

type RoadmapColumnProps = {
    id: Exclude<RoadmapItemStatus, "released">;
    label: string;
    icon: LucideIcon;
    items: RoadmapItem[];
    accent: string;
    onSelect: (item: RoadmapItem) => void;
};

function RoadmapColumn({
    label,
    icon: StatusIcon,
    items,
    accent,
    onSelect,
}: RoadmapColumnProps) {
    return (
        <section className="relative w-full rounded-xl bg-[#1d1b18] p-3 sm:p-4">
            <span
                className="absolute -left-[23px] top-5 h-[13px] w-[13px] rounded-full border-2 border-[#0d0c0b]"
                style={{
                    backgroundColor:
                        items.length > 0 ? accent : "rgb(255 255 255 / 20%)",
                }}
                aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2.5">
                    <StatusIcon className="h-4 w-4" strokeWidth={2} />
                    <h3 className="font-minecraft text-sm font-bold text-white">
                        {label}
                    </h3>
                </span>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/6 px-2 text-[10px] font-bold text-white/42">
                    {items.length}
                </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {items.map((item) => (
                    <RoadmapItemCard
                        key={item.id}
                        item={item}
                        accent={accent}
                        onSelect={() => onSelect(item)}
                    />
                ))}
            </div>
        </section>
    );
}

type ReleaseDetailsProps = {
    project: RoadmapProject;
    items: RoadmapItem[];
};

export function ReleaseDetails({ project, items }: ReleaseDetailsProps) {
    const [query, setQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
    const activeItems = items.filter((item) => item.status !== "released");
    const completedItems = activeItems.filter(
        (item) => item.status === "done",
    ).length;
    const progress =
        activeItems.length > 0
            ? Math.round((completedItems / activeItems.length) * 100)
            : 0;
    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return items;

        return items.filter((item) =>
            [
                item.title,
                item.description,
                ...item.categories.map(
                    (category) => categoryConfig[category].label,
                ),
            ]
                .filter(Boolean)
                .some((value) =>
                    value?.toLowerCase().includes(normalizedQuery),
                ),
        );
    }, [items, query]);
    const releasedItems = filteredItems.filter(
        (item) => item.status === "released",
    );

    useEffect(() => {
        setQuery("");
        setSelectedItem(null);
    }, [project.id]);

    return (
        <section
            id="roadmap-board-view"
            className="flex min-h-[500px] min-w-0 flex-col rounded-xl bg-[#0d0c0b] p-5 sm:p-6"
            aria-live="polite"
            role="tabpanel"
        >
            <div className="flex shrink-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <span
                        className="rounded-md px-3 py-1.5 font-minecraft text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{
                            backgroundColor: project.accent,
                            color: project.accentText,
                        }}
                    >
                        Roadmap
                    </span>
                    <p className="mt-3 text-xs font-semibold text-white/38">
                        Work moves from planning through review to completion.
                    </p>
                </div>

                <div className="w-full max-w-sm">
                    <div className="flex items-center justify-between gap-4 text-xs font-medium text-white/42">
                        <span>
                            {completedItems} of {activeItems.length} complete
                        </span>
                        <span>{progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/7">
                        <div
                            className="h-full rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: project.accent,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-5 flex shrink-0 flex-col gap-3 border-t border-white/6 pt-5 xl:flex-row xl:items-center">
                <label className="relative block min-w-0 flex-1">
                    <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32"
                        strokeWidth={2}
                    />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search roadmap"
                        className="h-11 w-full rounded-lg bg-[#171614] pl-10 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/28 focus:bg-[#211f1b]"
                    />
                </label>
                <span className="text-xs font-medium text-white/34">
                    {filteredItems.length - releasedItems.length} changes shown
                </span>
            </div>

            <div className="mt-4">
                {filteredItems.length === 0 ? (
                    <div className="flex min-h-48 items-center justify-center rounded-xl bg-[#1d1b18] px-6 text-center">
                        <div>
                            <span className="font-minecraft text-sm font-bold text-white/72">
                                No matching changes
                            </span>
                            <p className="mt-2 text-sm font-medium leading-6 text-white/38">
                                Adjust the search to see more roadmap items.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative flex min-w-0 flex-col gap-3 pb-3 pl-7">
                            <span
                                className="absolute bottom-3 left-[11px] top-2 w-px bg-white/10"
                                aria-hidden="true"
                            />
                            {statusColumns.map((status) => (
                                <RoadmapColumn
                                    key={status.id}
                                    {...status}
                                    items={filteredItems.filter(
                                        (item) => item.status === status.id,
                                    )}
                                    accent={project.accent}
                                    onSelect={setSelectedItem}
                                />
                            ))}
                        </div>

                        <details className="group mt-4 rounded-xl bg-[#1d1b18]">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:content-none">
                                <span className="flex items-center gap-2.5">
                                    <Rocket
                                        className="h-4 w-4"
                                        style={{ color: project.accent }}
                                        strokeWidth={2}
                                    />
                                    <span className="font-minecraft text-sm font-bold text-white">
                                        Released
                                    </span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/6 px-2 text-[10px] font-bold text-white/42">
                                        {releasedItems.length}
                                    </span>
                                </span>
                                <ChevronDown
                                    className="h-4 w-4 text-white/42 transition-transform duration-300 group-open:rotate-180"
                                    strokeWidth={2}
                                />
                            </summary>
                            <div className="grid gap-3 border-t border-white/6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {releasedItems.length > 0 ? (
                                    releasedItems.map((item) => (
                                        <RoadmapItemCard
                                            key={item.id}
                                            item={item}
                                            accent={project.accent}
                                            onSelect={() =>
                                                setSelectedItem(item)
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm font-medium text-white/38">
                                        No released changes yet.
                                    </p>
                                )}
                            </div>
                        </details>
                    </>
                )}
            </div>

            {selectedItem ? (
                <RoadmapItemModal
                    item={selectedItem}
                    project={project}
                    onClose={() => setSelectedItem(null)}
                />
            ) : null}
        </section>
    );
}
