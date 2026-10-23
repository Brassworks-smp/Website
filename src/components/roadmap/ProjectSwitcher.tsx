import type { RoadmapProject } from "../../features/roadmap/roadmap.service";

type ProjectSwitcherProps = {
    projects: RoadmapProject[];
    itemCounts: Record<string, number>;
    activeProjectId: string;
    onSelect: (projectId: string) => void;
};

export function ProjectSwitcher({
    projects,
    itemCounts,
    activeProjectId,
    onSelect,
}: ProjectSwitcherProps) {
    return (
        <div
            className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
            role="tablist"
            aria-label="Choose a roadmap project"
        >
            {projects.map((project) => {
                const active = project.id === activeProjectId;

                return (
                    <button
                        key={project.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls="roadmap-board-view"
                        onClick={() => onSelect(project.id)}
                        className={`group flex min-w-0 max-w-[75vw] shrink-0 cursor-pointer items-center gap-2.5 rounded-lg border-2 py-2 pl-2 pr-4 text-left outline-none transition-[background-color,border-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:max-w-xs ${
                            active
                                ? "bg-[#211f1b] text-white"
                                : "border-transparent bg-[#1d1b18] text-white/62 hover:bg-[#211f1b] hover:text-white"
                        }`}
                        style={{
                            borderColor: active ? project.accent : undefined,
                        }}
                    >
                        {project.logo ? (
                            <img
                                src={project.logo}
                                alt=""
                                className="h-8 w-8 shrink-0 rounded-md object-cover"
                                draggable="false"
                                decoding="async"
                            />
                        ) : (
                            <span
                                className="h-8 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: project.accent }}
                            />
                        )}
                        <span className="min-w-0 flex-1">
                            <span className="block truncate font-minecraft text-sm font-bold">
                                {project.name}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-white/40">
                                <span>
                                    {itemCounts[project.id] ?? 0} changes
                                </span>
                                {active ? (
                                    <span style={{ color: project.accent }}>
                                        Selected
                                    </span>
                                ) : null}
                            </span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
