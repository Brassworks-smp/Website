import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";
import type { CockpitMember } from "../members/members.service";

export type RoadmapItemStatus =
    "planned" | "in_progress" | "testing" | "done" | "released";

export type RoadmapItemCategory = "addition" | "update" | "fix" | "technical";

export type RoadmapImage = {
    id: string;
    source: string;
    alt: string;
};

export type RoadmapContributor = {
    id: string;
    name: string;
    role: string | null;
    avatar: string | null;
};

export type RoadmapProject = {
    id: string;
    name: string;
    logo: string | null;
    accent: string;
    accentText: string;
    order: number;
};

export type RoadmapItem = {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    details?: string | null;
    images?: RoadmapImage[];
    contributors?: RoadmapContributor[];
    categories: RoadmapItemCategory[];
    status: RoadmapItemStatus;
    order: number;
};

export type RoadmapData = {
    projects: RoadmapProject[];
    items: RoadmapItem[];
};

type CockpitSelectOption = string | { label?: string; value?: string };

type CockpitSelectValue = CockpitSelectOption | CockpitSelectOption[] | null;

type CockpitRichText =
    | string
    | {
          html?: string;
          value?: string;
          content?: string;
      }
    | null;

type CockpitPopulatedRelation<T> = T | T[] | { data?: T | T[] } | null;

type CockpitRoadmapAsset = CockpitAsset & {
    altText?: string;
};

type CockpitRelation =
    | string
    | { _id?: string; data?: CockpitRelation | CockpitRelation[] }
    | CockpitRelation[]
    | null;

type CockpitRoadmapProject = {
    _id?: string;
    name?: string;
    logo?: CockpitAsset | null;
    accent?: string;
    accent_text?: string;
    order?: number | string;
    active?: boolean | number | string;
};

type CockpitRoadmapItem = {
    _id?: string;
    project?: CockpitRelation;
    title?: string;
    description?: string;
    details?: CockpitRichText;
    images?: CockpitRoadmapAsset | CockpitRoadmapAsset[] | null;
    contributors?: CockpitPopulatedRelation<CockpitMember>;
    category?: CockpitSelectValue;
    status?: CockpitSelectValue;
    order?: number | string;
    active?: boolean | number | string;
};

function isEnabled(value: boolean | number | string | undefined): boolean {
    if (value === undefined) return true;
    if (value === false || value === 0) return false;

    return !["0", "false"].includes(String(value).trim().toLowerCase());
}

function itemOrder(value: number | string | undefined): number {
    const order = Number(value);

    return Number.isFinite(order) ? order : 0;
}

function selectValue(value: CockpitSelectValue | undefined): string {
    if (typeof value === "string") return value.trim().toLowerCase();
    if (Array.isArray(value)) return selectValue(value[0]);

    return (value?.value ?? value?.label ?? "").trim().toLowerCase();
}

function selectValues(value: CockpitSelectValue | undefined): string[] {
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return values.map(selectValue).filter(Boolean);
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

function populatedRelationItems<T>(
    relation: CockpitPopulatedRelation<T> | undefined,
): T[] {
    if (!relation) return [];
    if (Array.isArray(relation)) return relation;
    if (typeof relation === "object" && "data" in relation) {
        if (!relation.data) return [];
        return Array.isArray(relation.data) ? relation.data : [relation.data];
    }

    return [relation];
}

function mapContributor(member: CockpitMember): RoadmapContributor | null {
    const id = member._id?.trim();
    const name = member.name?.trim();

    if (!id || !name) return null;

    return {
        id,
        name,
        role: member.role?.trim() || null,
        avatar: cockpitAssetUrl(member.assets?.head),
    };
}

function mapRoadmapImage(
    asset: CockpitRoadmapAsset,
    index: number,
): RoadmapImage | null {
    const source = cockpitAssetUrl(asset);

    if (!source) return null;

    return {
        id: asset._id?.trim() || `${source}-${index}`,
        source,
        alt: asset.altText?.trim() || asset.title?.trim() || "",
    };
}

function relationId(value: CockpitRelation | undefined): string | null {
    if (!value) return null;
    if (typeof value === "string") return value.trim() || null;

    if (Array.isArray(value)) {
        for (const item of value) {
            const id = relationId(item);

            if (id) return id;
        }

        return null;
    }

    const id = value._id?.trim();

    if (id) return id;

    return relationId(value.data);
}

function isItemStatus(value: string): value is RoadmapItemStatus {
    return ["planned", "in_progress", "testing", "done", "released"].includes(
        value,
    );
}

function normalizeItemCategory(value: string): RoadmapItemCategory | null {
    if (value === "addition" || value === "feature") return "addition";
    if (value === "update" || value === "improvement") return "update";
    if (value === "fix" || value === "technical") return value;

    return null;
}

function mapProject(item: CockpitRoadmapProject): RoadmapProject | null {
    const id = item._id?.trim();
    const name = item.name?.trim();
    const accent = item.accent?.trim();
    const accentText = item.accent_text?.trim();

    if (!id || !name || !accent || !accentText) return null;

    return {
        id,
        name,
        logo: cockpitAssetUrl(item.logo),
        accent,
        accentText,
        order: itemOrder(item.order),
    };
}

function mapItem(item: CockpitRoadmapItem): RoadmapItem | null {
    const id = item._id?.trim();
    const projectId = relationId(item.project);
    const title = item.title?.trim();
    const categories = selectValues(item.category)
        .map(normalizeItemCategory)
        .filter(
            (category): category is RoadmapItemCategory => category !== null,
        );
    const status = selectValue(item.status);

    if (!id || !projectId || !title || !isItemStatus(status)) return null;

    return {
        id,
        projectId,
        title,
        description: item.description?.trim() || null,
        details: resolveRichTextAssets(richTextHtml(item.details)) || null,
        images: (Array.isArray(item.images)
            ? item.images
            : item.images
              ? [item.images]
              : []
        )
            .map(mapRoadmapImage)
            .filter((image): image is RoadmapImage => image !== null),
        contributors: populatedRelationItems(item.contributors)
            .map(mapContributor)
            .filter(
                (contributor): contributor is RoadmapContributor =>
                    contributor !== null,
            ),
        categories: [...new Set(categories)],
        status,
        order: itemOrder(item.order),
    };
}

export async function getRoadmapData(): Promise<RoadmapData> {
    const [projectItems, roadmapItems] = await Promise.all([
        cockpit.items<CockpitRoadmapProject>("roadmapprojects", {
            sort: { order: 1 },
        }),
        cockpit.items<CockpitRoadmapItem>("roadmapitems", {
            sort: { order: 1 },
            populate: 2,
        }),
    ]);

    return {
        projects: projectItems
            .filter((item) => isEnabled(item.active))
            .map(mapProject)
            .filter((item): item is RoadmapProject => item !== null)
            .sort((a, b) => a.order - b.order),
        items: roadmapItems
            .filter((item) => isEnabled(item.active))
            .map(mapItem)
            .filter((item): item is RoadmapItem => item !== null)
            .sort((a, b) => a.order - b.order),
    };
}
