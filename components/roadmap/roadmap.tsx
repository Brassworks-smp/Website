"use client";

import { useState, useEffect } from "react";
import { fetchTasks, fetchCurrentVersion, ApiTask } from "../../lib/services/roadmapService";

type TaskStatus = "Unconfirmed" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner?: string;
  category?: string;
}

interface StatusGroup {
  status: TaskStatus;
  tasks: Task[];
}

const API_STATUS_MAP: Record<ApiTask["status"], TaskStatus> = {
  unconfirmed: "Unconfirmed",
  in_progress: "In Progress",
  done: "Done",
};

const CATEGORY_MAP: Record<ApiTask["type"], string> = {
  additions: "Additions",
  fixes: "Fixes",
  removals: "Removals",
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
  Done: {
    bg: "bg-green-500",
    border: "border-green-500",
    ring: "ring-green-400",
    shadow: "shadow-[0_3px_0_green-700]",
  },
};

const STATUS_ORDER: Record<TaskStatus, number> = {
  Done: 3,
  "In Progress": 2,
  Unconfirmed: 1,
};

const STATUS_LIST: TaskStatus[] = ["Unconfirmed", "In Progress", "Done"];

export default function Roadmap() {
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([]);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [currentVersion, setCurrentVersion] = useState<string>("...");

  useEffect(() => {
    async function load() {
      try {
        const [tasks, version] = await Promise.all([
          fetchTasks(),
          fetchCurrentVersion(),
        ]);

        setCurrentVersion(version);

        const grouped: Record<TaskStatus, Task[]> = {
          Unconfirmed: [],
          "In Progress": [],
          Done: [],
        };

        const filteredTasks = tasks.filter(t => t.version === version);

        for (const t of filteredTasks) {
          const status = API_STATUS_MAP[t.status];
          if (!status) continue;

          const owner = t.assignee_name && t.assignee_name !== "Unassigned" ? t.assignee_name : undefined;
          const description = t.description && t.description !== "No description provided." ? t.description : undefined;

          if (!grouped[status]) grouped[status] = [];
          grouped[status].push({
            id: t.id,
            title: t.name,
            status,
            owner,
            description,
            category: CATEGORY_MAP[t.type],
          });
        }


        const finalGroups: StatusGroup[] = Object.entries(grouped).map(
          ([status, tasks]) => ({
            status: status as TaskStatus,
            tasks: tasks.sort((a, b) => {
              if (!a.category) return 1;
              if (!b.category) return -1;
              return a.category.localeCompare(b.category);
            }),
          })
        );

        setStatusGroups(finalGroups);
      } catch (e) {
        console.error("Failed loading tasks", e);
      }
    }

    load();
  }, []);

  const toggleGroup = (status: TaskStatus, category?: string) => {
    const key = category ? `${status}-${category}` : status;
    setCollapsedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section className="bg-cover bg-[url(/images/background.png)]">
      <div className="min-h-[90vh] container mx-auto px-3 sm:px-4 py-8 sm:py-12 mt-12 sm:mt-16">
        <div className="mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Modpack Roadmap</p>
          <h2 className="text-3xl md:text-4xl font-bold font-minecraft">Version {currentVersion}</h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {statusGroups.map((group) => {
              const categories = Array.from(
                new Set(group.tasks.map((t) => t.category ?? "Uncategorized"))
              );

              return (
                <div key={group.status} className="w-[85vw] sm:w-auto sm:min-w-[260px] sm:max-w-sm flex-shrink-0 sm:flex-1 rounded-md flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b-2 rounded-t-md border-stone-800 bg-stone-900/70">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm text-stone-100 font-bold">{group.status}</h3>
                      <span className="inline-flex items-center justify-center text-[11px] min-w-[22px] h-[20px] rounded-full bg-stone-800 text-stone-200">{group.tasks.length}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-3 py-3 max-h-[60vh] bg-card rounded-b-md overflow-y-auto">
                    {categories.map((cat) => {
                      const tasksByCategory = group.tasks.filter((t) => t.category === cat);
                      const key = `${group.status}-${cat}`;
                      const isCollapsed = collapsedGroups[key];

                      return (
                        <div key={cat} className="rounded-lg bg-stone-950/70 border-stone-600/20 border-2">
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.status, cat)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-stone-200 bg-stone-900/70 rounded-t-md"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold">{cat}</span>
                              <span className="inline-flex items-center justify-center text-[10px] min-w-[20px] h-[18px] rounded-full bg-stone-800 text-stone-200">{tasksByCategory.length}</span>
                            </div>
                            <span className="text-[11px]">{isCollapsed ? "▶" : "▼"}</span>
                          </button>

                          {!isCollapsed && (
                            <div className="flex flex-col gap-2 px-2.5 py-2">
                              {tasksByCategory.map((task) => (
                                <div
                                  key={`${group.status}-${cat}-${task.id}`}
                                  className="relative flex flex-col gap-2 p-3 rounded-md border border-stone-800 bg-card hover:border-stone-600 hover:bg-stone-900/70 transition-all duration-200"
                                >
                                  <div className="text-sm text-white break-words">{task.title}</div>
                                  {task.description && (
                                    <div className="text-xs mb-1.5 text-stone-300 break-words">{task.description}</div>
                                  )}

                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      {task.owner && (
                                        <div className="font-minecraft inline-flex items-center px-2.5 py-1 h-7 text-[11px] text-white bg-amber-500 border border-amber-600 ring-2 ring-inset ring-amber-400 shadow-[0_3px_theme(colors.amber.700)] rounded-md" title={task.owner}>
                                          {task.owner}
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
  );
}