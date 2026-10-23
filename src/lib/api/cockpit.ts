import { HttpClient } from "./http-client";

const apiUrl = import.meta.env.VITE_COCKPIT_API_URL as string | undefined;
const apiKey = import.meta.env.VITE_COCKPIT_API_KEY as string | undefined;
const configuredAssetUrl = import.meta.env.VITE_COCKPIT_ASSET_URL as
    string | undefined;

if (!apiUrl) {
    throw new Error("VITE_COCKPIT_API_URL is missing");
}

export const cockpitOrigin = new URL(apiUrl).origin;
const cockpitAssetBaseUrl = configuredAssetUrl
    ? `${configuredAssetUrl.replace(/\/$/, "")}/`
    : new URL("/storage/uploads/", cockpitOrigin).toString();

const http = new HttpClient(apiUrl, apiKey ? { "API-KEY": apiKey } : {});

type CockpitListResponse<T> = T[] | { data: T[]; meta?: { total?: number } };

export type CockpitAsset = {
    _id?: string;
    path?: string;
    title?: string;
    mime?: string;
};

export type FindItemsOptions = {
    filter?: Record<string, unknown>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
    skip?: number;
    locale?: string;
    populate?: number;
};

export const cockpit = {
    async items<T>(
        model: string,
        options: FindItemsOptions = {},
    ): Promise<T[]> {
        const response = await http.get<CockpitListResponse<T>>(
            `/content/items/${encodeURIComponent(model)}`,
            { query: options },
        );

        return Array.isArray(response) ? response : response.data;
    },

    async item<T>(model: string, id: string): Promise<T> {
        return http.get<T>(
            `/content/item/${encodeURIComponent(model)}/${encodeURIComponent(id)}`,
        );
    },

    async singleton<T>(model: string): Promise<T> {
        return http.get<T>(`/content/item/${encodeURIComponent(model)}`);
    },
};

export function cockpitAssetUrl(
    asset: CockpitAsset | string | null | undefined,
): string | null {
    const path = typeof asset === "string" ? asset : asset?.path;

    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.replace(/^\/+/, "");

    if (normalizedPath.startsWith("storage/")) {
        return new URL(normalizedPath, `${cockpitOrigin}/`).toString();
    }

    return new URL(normalizedPath, cockpitAssetBaseUrl).toString();
}
