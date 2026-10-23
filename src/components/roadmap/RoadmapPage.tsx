import { useEffect, useMemo, useState } from "react";
import { useRoadmap } from "../../features/roadmap/use-roadmap";
import { Footer } from "../general/Footer";
import { Header } from "../general/Header";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { ReleaseDetails } from "./ReleaseDetails";

export function RoadmapPage() {
    const { data } = useRoadmap();
    const [activeProjectId, setActiveProjectId] = useState("");
    const roadmapData = useMemo(
        () => data ?? { projects: [], items: [] },
        [data],
    );
    const availableProjects = useMemo(
        () =>
            roadmapData.projects.filter((project) =>
                roadmapData.items.some((item) => item.projectId === project.id),
            ),
        [roadmapData],
    );
    const itemCounts = useMemo(
        () =>
            Object.fromEntries(
                availableProjects.map((project) => [
                    project.id,
                    roadmapData.items.filter(
                        (item) =>
                            item.projectId === project.id &&
                            item.status !== "released",
                    ).length,
                ]),
            ),
        [availableProjects, roadmapData.items],
    );
    const activeProject =
        availableProjects.find((project) => project.id === activeProjectId) ??
        availableProjects[0];
    const activeItems = useMemo(
        () =>
            roadmapData.items.filter(
                (item) => item.projectId === activeProject?.id,
            ),
        [activeProject?.id, roadmapData.items],
    );
    const activeWorkItems = activeItems.filter(
        (item) => item.status !== "released",
    );
    const completedItems = activeItems.filter(
        (item) => item.status === "done",
    ).length;

    useEffect(() => {
        if (!activeProject && availableProjects[0]) {
            setActiveProjectId(availableProjects[0].id);
            return;
        }

        if (activeProject && activeProject.id !== activeProjectId) {
            setActiveProjectId(activeProject.id);
        }
    }, [activeProject, activeProjectId, availableProjects]);

    if (!activeProject || availableProjects.length === 0) {
        return (
            <>
                <Header />
                <main className="h-[100svh] bg-[#171614] pt-[60px]" />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-[100svh] bg-[#171614] px-3 pb-8 pt-[88px] text-white sm:px-6 sm:pt-[94px] lg:px-[60px]">
                <div className="mx-auto flex min-h-full max-w-[1600px] flex-col">
                    <header className="flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                                Project Roadmaps
                            </span>
                            <h1 className="mt-2 font-minecraft text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                Roadmap
                            </h1>
                        </div>
                        <p className="max-w-2xl text-sm font-medium leading-6 text-white/58 sm:text-base sm:leading-7 lg:text-right">
                            Follow planned work, active development, testing,
                            completed tasks, and released changes across
                            Brassworks projects.
                        </p>
                    </header>

                    <div className="mt-5 shrink-0 sm:mt-6">
                        <ProjectSwitcher
                            projects={availableProjects}
                            itemCounts={itemCounts}
                            activeProjectId={activeProject.id}
                            onSelect={setActiveProjectId}
                        />
                    </div>

                    <section className="mt-3 shrink-0 rounded-xl bg-[#0d0c0b] px-5 py-4 sm:px-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                {activeProject.logo ? (
                                    <img
                                        src={activeProject.logo}
                                        alt=""
                                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                        draggable="false"
                                        decoding="async"
                                    />
                                ) : (
                                    <span
                                        className="h-12 w-2 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor:
                                                activeProject.accent,
                                        }}
                                    />
                                )}
                                <span className="min-w-0">
                                    <h2 className="font-minecraft text-lg font-bold sm:text-xl">
                                        {activeProject.name}
                                    </h2>
                                </span>
                            </div>

                            <dl className="grid shrink-0 grid-cols-2 gap-5 sm:gap-8">
                                <div>
                                    <dt className="text-xs font-medium text-white/36">
                                        Changes
                                    </dt>
                                    <dd className="mt-1 font-minecraft text-lg font-bold text-white">
                                        {activeWorkItems.length}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-white/36">
                                        Done
                                    </dt>
                                    <dd
                                        className="mt-1 font-minecraft text-lg font-bold"
                                        style={{ color: activeProject.accent }}
                                    >
                                        {completedItems}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <div className="mt-3 min-h-0 flex-1">
                        <ReleaseDetails
                            project={activeProject}
                            items={activeItems}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
