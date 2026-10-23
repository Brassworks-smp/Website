const SITE_NAME = "Brassworks";
const SITE_URL = "https://brassworks.opnsoc.org";

type PageMetadata = {
    title: string;
    description: string;
    path: string;
    image?: string;
    imageAlt?: string;
    type?: "website" | "article";
};

function absoluteUrl(value: string) {
    return new URL(value, SITE_URL).toString();
}

export function createPageMetadata({
    title,
    description,
    path,
    image,
    imageAlt,
    type = "website",
}: PageMetadata) {
    const url = absoluteUrl(path);
    const imageUrl = image ? absoluteUrl(image) : undefined;

    return {
        meta: [
            { title },
            { name: "description", content: description },
            { name: "robots", content: "index, follow" },
            { property: "og:type", content: type },
            { property: "og:site_name", content: SITE_NAME },
            { property: "og:locale", content: "en_US" },
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { property: "og:url", content: url },
            ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
            ...(imageUrl && imageAlt
                ? [{ property: "og:image:alt", content: imageAlt }]
                : []),
            {
                name: "twitter:card",
                content: imageUrl ? "summary_large_image" : "summary",
            },
            { name: "twitter:title", content: title },
            { name: "twitter:description", content: description },
            ...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
            ...(imageUrl && imageAlt
                ? [{ name: "twitter:image:alt", content: imageAlt }]
                : []),
        ],
        links: [{ rel: "canonical", href: url }],
    };
}
