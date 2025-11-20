// ----------------------------------------
// 🔹 Types
// ----------------------------------------

export interface ApiTask {
  id: string;
  name: string;
  type: "additions" | "fixes" | "removals";
  status: "unconfirmed" | "in_progress" | "done";
  version: string;
  description?: string;
  assignee_id?: number | null;
  assignee_name?: string | null;
}

export interface ApiVersion {
  current_version: string;
}

// ----------------------------------------
// 🔹 API base URL
// ----------------------------------------

const API_BASE = "https://api.opnsoc.org/roadmap";

// ----------------------------------------
// 🔹 Fetch: All tasks (no caching)
// ----------------------------------------

export async function fetchTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${API_BASE}/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return res.json();
}

// ----------------------------------------
// 🔹 Fetch: Current version (no caching)
// ----------------------------------------

export async function fetchCurrentVersion(): Promise<string> {
  const res = await fetch(`${API_BASE}/version`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch version");

  const data: ApiVersion = await res.json();
  return data.current_version;
}