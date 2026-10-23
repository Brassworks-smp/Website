import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";
import type { CockpitMember } from "../members/members.service";

export type NewsAuthor = {
    id: string;
    name: string;
    role: string | null;
    bio: string | null;
    avatar: string | null;
};

export type NewsArticle = {
    id: string;
    title: string;
    tag: string;
    description: string;
    content: string;
    cover: string;
    coverAlt: string;
    publishedAt: string;
    authors: NewsAuthor[];
};

type CockpitRelation<T> = T | T[] | { data?: T | T[] } | null;

type CockpitRichText =
    | string
    | {
          html?: string;
          value?: string;
          content?: string;
      }
    | null;

type CockpitNewsArticle = {
    _id: string;
    title?: string;
    tag?: string;
    description?: string;
    content?: CockpitRichText;
    cover?: CockpitAsset | null;
    cover_alt?: string;
    published_at?: string;
    published?: boolean | number | string;
    authors?: CockpitRelation<CockpitMember>;
};

function isEnabled(value: boolean | number | string | undefined): boolean {
    if (value === undefined) return true;
    if (value === false || value === 0) return false;

    return !["0", "false"].includes(String(value).trim().toLowerCase());
}

function richTextHtml(value: CockpitRichText | undefined): string {
    if (typeof value === "string") return value.trim();
    if (!value) return "";

    const html = value.html ?? value.value ?? value.content;

    return typeof html === "string" ? html.trim() : "";
}

function resolveRichTextAssets(html: string): string {
    return html.replace(
        /\bsrc=(["'])([^"']+)\1/gi,
        (attribute, quote: string, source: string) => {
            if (
                /^(?:https?:)?\/\//i.test(source) ||
                /^(?:data|blob):/i.test(source)
            ) {
                return attribute;
            }

            const resolvedSource = cockpitAssetUrl(source);

            return resolvedSource
                ? `src=${quote}${resolvedSource}${quote}`
                : attribute;
        },
    );
}

function relationItems<T>(relation: CockpitRelation<T> | undefined): T[] {
    if (!relation) return [];
    if (Array.isArray(relation)) return relation;
    if (typeof relation === "object" && "data" in relation) {
        if (!relation.data) return [];
        return Array.isArray(relation.data) ? relation.data : [relation.data];
    }
    return [relation];
}

function mapAuthor(member: CockpitMember): NewsAuthor | null {
    const name = member.name?.trim();
    const id = member._id?.trim();

    if (!id || !name) return null;

    return {
        id,
        name,
        role: member.role?.trim() || null,
        bio: member.description?.trim() || null,
        avatar: cockpitAssetUrl(member.assets?.head),
    };
}

function mapArticle(item: CockpitNewsArticle): NewsArticle | null {
    const title = item.title?.trim();
    const tag = item.tag?.trim();
    const description = item.description?.trim();
    const content = resolveRichTextAssets(richTextHtml(item.content));
    const cover = cockpitAssetUrl(item.cover);
    const coverAlt = item.cover_alt?.trim() ?? "";
    const publishedAt = item.published_at?.trim();

    if (!item._id || !title || !tag || !description || !cover || !publishedAt)
        return null;

    return {
        id: item._id,
        title,
        tag,
        description,
        content,
        cover,
        coverAlt,
        publishedAt,
        authors: relationItems(item.authors)
            .map(mapAuthor)
            .filter((author): author is NewsAuthor => author !== null),
    };
}

export async function getLatestNews(limit = 4): Promise<NewsArticle[]> {
    const items = await cockpit.items<CockpitNewsArticle>("news", {
        sort: { published_at: -1 },
        populate: 2,
    });

    return items
        .filter((item) => isEnabled(item.published))
        .map(mapArticle)
        .filter((article): article is NewsArticle => article !== null)
        .slice(0, limit);
}

export async function getAllNews(): Promise<NewsArticle[]> {
    const items = await cockpit.items<CockpitNewsArticle>("news", {
        sort: { published_at: -1 },
        populate: 2,
    });

    return items
        .filter((item) => isEnabled(item.published))
        .map(mapArticle)
        .filter((article): article is NewsArticle => article !== null);
}

export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
    const items = await cockpit.items<CockpitNewsArticle>("news", {
        filter: { _id: id },
        limit: 1,
        populate: 2,
    });
    const item = items[0];

    return item && isEnabled(item.published) ? mapArticle(item) : null;
}
