"use client";

import { useEffect, useState } from "react";
import { fetchTasks, fetchCurrentVersion, ApiTask } from "../../lib/services/roadmapService";

type TaskStatus = "Unconfirmed" | "In Progress" | "In Testing" | "Under Review" | "Done" | "Released";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner?: string;
  version: string;
  category?: string;
  subcategory?: string;
  imageUrl?: string;
}

interface VersionGroup {
  version: string;
  tasks: Task[];
}

const API_STATUS_MAP: Record<ApiTask["status"], TaskStatus> = {
  unconfirmed: "Unconfirmed",
  in_progress: "In Progress",
  in_testing: "In Testing",
  under_review: "Under Review",
  done: "Done",
  released: "Released",
};

const CATEGORY_MAP: Record<ApiTask["type"], string> = {
  additions: "Addition",
  fixes: "Fix",
  removals: "Removal",
};

const STATUS_COLOR: Record<
    TaskStatus,
    { bg: string; border: string; ring: string; shadow: string }
> = {
  Unconfirmed: {
    bg: "bg-gray-500",
    border: "border-gray-500",
    ring: "ring-gray-400",
    shadow: "shadow-[0_3px_0_gray-700]",
  },
  "In Progress": {
    bg: "bg-blue-500",
    border: "border-blue-500",
    ring: "ring-blue-400",
    shadow: "shadow-[0_3px_0_blue-700]",
  },
  "In Testing": {
    bg: "bg-cyan-500",
    border: "border-cyan-500",
    ring: "ring-cyan-400",
    shadow: "shadow-[0_3px_0_cyan-700]",
  },
  "Under Review": {
    bg: "bg-violet-500",
    border: "border-violet-500",
    ring: "ring-violet-400",
    shadow: "shadow-[0_3px_0_violet-700]",
  },
  Done: {
    bg: "bg-green-500",
    border: "border-green-500",
    ring: "ring-green-400",
    shadow: "shadow-[0_3px_0_green-700]",
  },
  Released: {
    bg: "bg-emerald-500",
    border: "border-emerald-500",
    ring: "ring-emerald-400",
    shadow: "shadow-[0_3px_0_emerald-700]",
  },
};

const TYPE_COLOR: Record<string, string> = {
  Addition: "bg-emerald-500 border-emerald-500 ring-emerald-400 shadow-[0_3px_0_theme(colors.emerald.700)]",
  Fix: "bg-amber-500 border-amber-500 ring-amber-400 shadow-[0_3px_0_theme(colors.amber.700)]",
  Removal : "bg-rose-500 border-rose-500 ring-rose-400 shadow-[0_3px_0_theme(colors.rose.700)]",
};

function parseVersion(version: string) {
  const cleaned = version.replace(/[^\d.]/g, "");
  return cleaned.split(".").map((n) => Number(n) || 0);
}

function compareVersions(a: string, b: string) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const max = Math.max(pa.length, pb.length);

  for (let i = 0; i < max; i++) {
    const av = pa[i] ?? 0;
    const bv = pb[i] ?? 0;
    if (av !== bv) return av - bv;
  }

  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export default function Roadmap() {
  const [versionGroups, setVersionGroups] = useState<VersionGroup[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [currentVersion, setCurrentVersion] = useState<string>("...");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tasks, version] = await Promise.all([fetchTasks(), fetchCurrentVersion()]);
        setCurrentVersion(version);

        const mappedTasks: Task[] = tasks
            .map((t) => {
              const status = API_STATUS_MAP[t.status];
              if (!status) return null;

              const owner = t.assignee_name && t.assignee_name !== "Unassigned" ? t.assignee_name : undefined;
              const description = t.description && t.description !== "No description provided." ? t.description : undefined;
              const subcategory =
                  typeof t.subcategory === "string" && t.subcategory.trim().length > 0
                      ? t.subcategory.trim()
                      : "General";
              const imageUrl =
                  typeof t.image_url === "string" && t.image_url.trim().length > 0
                      ? t.image_url.trim()
                      : undefined;

              return {
                id: t.id,
                title: t.name,
                status,
                owner,
                description,
                category: CATEGORY_MAP[t.type],
                subcategory,
                version: t.version,
                imageUrl,
              };
            })
            .filter(Boolean) as Task[];

        const uniqueVersions = Array.from(new Set(mappedTasks.map((t) => t.version))).sort(compareVersions);
        const currentIndex = uniqueVersions.indexOf(version);
        const visibleVersions =
            currentIndex >= 0 ? uniqueVersions.slice(currentIndex, currentIndex + 4) : uniqueVersions.slice(0, 4);

        const groups: VersionGroup[] = visibleVersions.map((v) => ({
          version: v,
          tasks: mappedTasks
              .filter((t) => t.version === v)
              .sort((a, b) => {
                const sub = (a.subcategory || "").localeCompare(b.subcategory || "");
                if (sub !== 0) return sub;
                const cat = (a.category || "").localeCompare(b.category || "");
                if (cat !== 0) return cat;
                return a.title.localeCompare(b.title);
              }),
        }));

        setVersionGroups(groups);
      } catch (e) {
        console.error("Failed loading tasks", e);
      }
    }

    load();
  }, []);

  const toggleGroup = (version: string, subcategory?: string) => {
    const key = subcategory ? `${version}-${subcategory}` : version;
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
      <>
        <section className="bg-cover backdrop-blur-l bg-[url(/images/background.png)]">
          <div className="h-[calc(100vh-2.5rem)] sm:px-20 mx-auto py-8 sm:py-12">
            <div className="mx-auto text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Modpack Roadmap</p>
              <h2 className="text-3xl md:text-4xl font-bold font-minecraft">Version {currentVersion}</h2>
            </div>

            <div className="mx-auto">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {versionGroups.map((group) => {
                  const subcategories = Array.from(
                      new Set(group.tasks.map((t) => t.subcategory ?? "General"))
                  );

                  return (
                      <div
                          key={group.version}
                          className="min-w-[320px] sm:min-w-[360px] md:min-w-[420px] max-w-[480px] flex-shrink-0 rounded-md flex flex-col"
                      >
                        <div className="flex items-center justify-between px-3 py-2 border-b-2 rounded-t-md border-stone-800 bg-stone-900/70">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm text-stone-100 font-bold font-minecraft">
                              {group.version}
                            </h3>
                            {group.version === currentVersion && (
                                <span className="inline-flex items-center justify-center text-[10px] px-2 h-[20px] rounded-full bg-emerald-700 text-emerald-100 border border-emerald-500">
                            Current
                          </span>
                            )}
                            <span className="inline-flex items-center justify-center text-[11px] min-w-[22px] h-[20px] rounded-full bg-stone-800 text-stone-200">
                          {group.tasks.length}
                        </span>
                          </div>
                        </div>

                        <div
                            className="flex flex-col gap-3 px-3 py-3 lg:max-h-[60vh] bg-card rounded-b-md overflow-y-auto"
                            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                        >
                          {subcategories.map((subcat) => {
                            const tasksBySubcategory = group.tasks.filter((t) => (t.subcategory ?? "General") === subcat);
                            const key = `${group.version}-${subcat}`;
                            const isCollapsed = collapsedGroups[key];

                            return (
                                <div key={subcat} className="rounded-lg bg-stone-950/70 border-stone-600/20 border-2">
                                  <button
                                      type="button"
                                      onClick={() => toggleGroup(group.version, subcat)}
                                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-stone-200 bg-stone-900/70 rounded-t-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-semibold">{subcat}</span>
                                      <span className="inline-flex items-center justify-center text-[10px] min-w-[20px] h-[18px] rounded-full bg-stone-800 text-stone-200">
                                  {tasksBySubcategory.length}
                                </span>
                                    </div>
                                    <span className="text-[11px]">{isCollapsed ? "▶" : "▼"}</span>
                                  </button>

                                  {!isCollapsed && (
                                      <div className="flex flex-col gap-2 px-2.5 py-2">
                                        {tasksBySubcategory.map((task, index) => (
                                            <div
                                                key={`${group.version}-${subcat}-${task.id ?? index}`}
                                                className="relative flex flex-col gap-2 p-3 rounded-md border border-stone-800 bg-card hover:border-stone-600 hover:bg-stone-900/70 transition-all duration-200"
                                            >
                                              {task.imageUrl && (
                                                  <button
                                                      type="button"
                                                      onClick={() => setSelectedImage(task.imageUrl || null)}
                                                      className="w-full overflow-hidden rounded-md border border-stone-800 bg-stone-900/60"
                                                  >
                                                    <img
                                                        src={task.imageUrl}
                                                        alt={task.title}
                                                        className="w-full h-36 object-cover hover:scale-[1.02] transition-transform duration-200"
                                                    />
                                                  </button>
                                              )}

                                              <div className="text-sm text-white break-words">
                                                {task.title} <small className="text-stone-500">#{task.id}</small>
                                              </div>

                                              {task.description && (
                                                  <div className="text-xs mb-1.5 text-stone-300 break-words">
                                                    {task.description}
                                                  </div>
                                              )}

                                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  {task.owner && (
                                                      <div
                                                          className="font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400 shadow-[0_3px_theme(colors.amber.700)] rounded-md"
                                                          title={task.owner}
                                                      >
                                                        {task.owner}
                                                      </div>
                                                  )}

                                                  {task.category && (
                                                      <div
                                                          className={`font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white border ring-2 ring-inset rounded-md ${TYPE_COLOR[task.category]}`}
                                                          title={task.category}
                                                      >
                                                        {task.category}
                                                      </div>
                                                  )}
                                                </div>

                                                <div
                                                    className={`font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white border ring-2 ring-inset rounded-md ${STATUS_COLOR[task.status].bg} ${STATUS_COLOR[task.status].border} ${STATUS_COLOR[task.status].ring} ${STATUS_COLOR[task.status].shadow}`}
                                                    title={task.status}
                                                >
                                                  {task.status}
                                                </div>
                                              </div>
                                            </div>
                                        ))}
                                      </div>
                                  )}
                                </div>
                            );
                          })}
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {selectedImage && (
            <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
              <div
                  className="relative max-w-5xl w-full rounded-lg border-2 border-stone-700 bg-stone-950 p-2"
                  onClick={(e) => e.stopPropagation()}
              >
                <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute right-3 top-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-md bg-stone-900/90 border border-stone-700 text-white"
                >
                  ✕
                </button>
                <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full max-h-[85vh] object-contain rounded-md"
                />
              </div>
            </div>
        )}
      </>
  );
}