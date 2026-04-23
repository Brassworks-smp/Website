export interface ApiTask {
  id: string;
  name: string;
  type: "additions" | "fixes" | "removals";
  status: "unconfirmed" | "in_progress" | "in_testing" | "under_review" | "done" | "released";
  version: string;
  description?: string;
  assignee_id?: number | null;
  assignee_name?: string | null;
  subcategory?: string | null;
  image_url?: string | null;
}

export interface ApiVersion {
  current_version: string;
}

const API_BASE = "https://api.opnsoc.org/roadmap";

export async function fetchTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${API_BASE}/tasks`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch tasks");

  return res.json();
}

export async function fetchCurrentVersion(): Promise<string> {
  const res = await fetch(`${API_BASE}/version`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch version");

  const data: ApiVersion = await res.json();
  return data.current_version;
}