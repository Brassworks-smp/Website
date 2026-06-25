import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 8000;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function isBlockedHost(hostname: string): boolean {
    const h = hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".localhost") || h === "0.0.0.0") return true;
    if (h === "::1" || h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd"))
        return true;
    const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    if (m) {
        const [a, b] = [Number(m[1]), Number(m[2])];
        if (a === 127 || a === 10 || a === 0) return true;
        if (a === 169 && b === 254) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
    }
    return false;
}

export async function GET(req: NextRequest) {
    const target = req.nextUrl.searchParams.get("url");
    if (!target) {
        return new Response("Missing url", { status: 400 });
    }

    let url: URL;
    try {
        url = new URL(target);
    } catch {
        return new Response("Invalid url", { status: 400 });
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return new Response("Unsupported protocol", { status: 400 });
    }
    if (isBlockedHost(url.hostname)) {
        return new Response("Blocked host", { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const upstream = await fetch(url.toString(), {
            signal: controller.signal,
            redirect: "follow",
            headers: { Accept: "image/*" },
        });

        if (!upstream.ok || !upstream.body) {
            return new Response("Upstream error", { status: 502 });
        }

        const contentType = upstream.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) {
            return new Response("Not an image", { status: 415 });
        }

        const declaredLength = Number(upstream.headers.get("content-length") || 0);
        if (declaredLength && declaredLength > MAX_BYTES) {
            return new Response("Image too large", { status: 413 });
        }

        const buffer = await upstream.arrayBuffer();
        if (buffer.byteLength > MAX_BYTES) {
            return new Response("Image too large", { status: 413 });
        }

        return new Response(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600, s-maxage=86400",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch {
        return new Response("Fetch failed", { status: 502 });
    } finally {
        clearTimeout(timeout);
    }
}
