import type { Metadata } from "next";
import { InstallLanding } from "@/components/general/install-landing";
import { InstallGenerator } from "@/components/general/install-generator";

const SITE = "https://brassworks.opnsoc.org";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(v: string | string[] | undefined): string | undefined {
    if (Array.isArray(v)) return v[0];
    return v;
}

function buildQuery(params: SearchParams): URLSearchParams {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string") query.set(key, value);
        else if (Array.isArray(value)) value.forEach((v) => query.append(key, v));
    }
    return query;
}

function hasInstallParams(params: SearchParams): boolean {
    return Boolean(params.pack_url || params.name);
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
    const params = await searchParams;

    if (!hasInstallParams(params)) {
        return {
            title: "Share an install link",
            description:
                "Turn a Brassworks Launcher install link into a clickable link you can share on Discord and anywhere else.",
        };
    }

    const name = firstValue(params.name) || "Brassworks modpack";
    const description =
        firstValue(params.description) ||
        "Open this modpack in the Brassworks Launcher.";
    const icon = firstValue(params.icon);
    const url = `${SITE}/install?${buildQuery(params).toString()}`;

    return {
        title: `Install ${name}`,
        description,
        openGraph: {
            title: name,
            description,
            url,
            type: "website",
            images: icon ? [icon] : ["/images/icon.png"],
        },
        twitter: {
            card: "summary",
            title: name,
            description,
            images: icon ? [icon] : ["/images/icon.png"],
        },
    };
}

export default async function InstallPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const showLanding = hasInstallParams(params);

    const query = buildQuery(params);
    const deepLink = `brassworks://install?${query.toString()}`;

    const unsupRaw = firstValue(params.unsup);

    return (
        <div className="relative mx-auto">
            <section className="px-6 pb-24 pt-28 text-zinc-100">
                <div className="container max-w-2xl mx-auto">
                    {showLanding ? (
                        <InstallLanding
                            deepLink={deepLink}
                            name={firstValue(params.name) || "Brassworks modpack"}
                            description={firstValue(params.description)}
                            icon={firstValue(params.icon)}
                            packUrl={firstValue(params.pack_url)}
                            minMemoryMb={firstValue(params.min_memory_mb)}
                            maxMemoryMb={firstValue(params.max_memory_mb)}
                            jvmArgs={firstValue(params.jvm_args)}
                            unsup={unsupRaw === "true" || unsupRaw === "1"}
                        />
                    ) : (
                        <InstallGenerator />
                    )}
                </div>
            </section>
        </div>
    );
}
