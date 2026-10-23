export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly body: unknown,
    ) {
        super(`HTTP ${status}`);
        this.name = "HttpError";
    }
}

type QueryValue = string | number | boolean | null | undefined | object;

export type RequestOptions = Omit<RequestInit, "body"> & {
    query?: Record<string, QueryValue>;
    body?: unknown;
};

function addQuery(url: URL, query?: Record<string, QueryValue>) {
    if (!query) return;

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;

        url.searchParams.set(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value),
        );
    }
}

export class HttpClient {
    constructor(
        private readonly baseUrl: string,
        private readonly defaultHeaders: HeadersInit = {},
    ) {}

    async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
        const url = new URL(
            path.replace(/^\//, ""),
            `${this.baseUrl.replace(/\/$/, "")}/`,
        );

        addQuery(url, options.query);

        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: "application/json",
                ...this.defaultHeaders,
                ...options.headers,
                ...(options.body === undefined
                    ? {}
                    : { "Content-Type": "application/json" }),
            },
            body:
                options.body === undefined
                    ? undefined
                    : JSON.stringify(options.body),
        });

        const contentType = response.headers.get("content-type") ?? "";
        const body = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            throw new HttpError(response.status, body);
        }

        return body as T;
    }

    get<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "GET" });
    }

    post<T>(path: string, body: unknown, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "POST", body });
    }

    patch<T>(path: string, body: unknown, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "PATCH", body });
    }

    delete<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: "DELETE" });
    }
}
