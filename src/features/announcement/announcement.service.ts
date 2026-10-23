import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

export type SiteAnnouncement = {
    version: string;
    title: string;
    description: string;
    actionLabel: string | null;
    actionUrl: string | null;
    background: string | null;
};

type CockpitAnnouncement = {
    _id?: string;
    _modified?: number | string;
    enabled?: boolean | number | string;
    title?: string;
    description?: string;
    action_label?: string;
    action_url?: string;
    background?: CockpitAsset | null;
};

function isEnabled(value: boolean | number | string | undefined): boolean {
    if (value === true || value === 1) return true;

    return ["1", "true"].includes(
        String(value ?? "")
            .trim()
            .toLowerCase(),
    );
}

export async function getSiteAnnouncement(): Promise<SiteAnnouncement | null> {
    const item = await cockpit.singleton<CockpitAnnouncement>("announcement");

    if (!isEnabled(item.enabled)) return null;

    const id = item._id?.trim();
    const modified = String(item._modified ?? "").trim();
    const title = item.title?.trim();
    const description = item.description?.trim();

    if (!id || !modified || !title || !description) return null;

    const actionLabel = item.action_label?.trim() || null;
    const actionUrl = item.action_url?.trim() || null;

    return {
        version: `${id}:${modified}`,
        title,
        description,
        actionLabel: actionLabel && actionUrl ? actionLabel : null,
        actionUrl: actionLabel && actionUrl ? actionUrl : null,
        background: cockpitAssetUrl(item.background),
    };
}
