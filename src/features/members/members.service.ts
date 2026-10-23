import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

export type Member = {
    id: string;
    name: string;
    role: string;
    description: string;
    entrySide: "left" | "right";
    background: string | null;
    head: string | null;
    skin: string | null;
    accent: string;
    accentText: string;
    order: number;
    showOnTeam: boolean;
};

export type CockpitMember = {
    _id?: string;
    name?: string;
    role?: string;
    description?: string;
    entry_side?: string;
    assets?: {
        background?: CockpitAsset | null;
        head?: CockpitAsset | null;
        skin?: CockpitAsset | null;
    } | null;
    accent?: string;
    accent_text?: string;
    order?: number;
    show_on_team?: boolean;
    active?: boolean;
};

export async function getMembers(): Promise<Member[]> {
    const items = await cockpit.items<CockpitMember>("members", {
        sort: { order: 1 },
    });

    return items
        .filter((item) => item.active === true && Number.isFinite(item.order))
        .map((item): Member | null => {
            const id = item._id?.trim();
            const name = item.name?.trim();
            const role = item.role?.trim();
            const description = item.description?.trim();
            const accent = item.accent?.trim();
            const accentText = item.accent_text?.trim();
            const entrySide = item.entry_side?.trim();

            if (
                !id ||
                !name ||
                !role ||
                !description ||
                !accent ||
                !accentText ||
                (entrySide !== "left" && entrySide !== "right")
            ) {
                return null;
            }

            return {
                id,
                name,
                role,
                description,
                entrySide,
                background: cockpitAssetUrl(item.assets?.background),
                head: cockpitAssetUrl(item.assets?.head),
                skin: cockpitAssetUrl(item.assets?.skin),
                accent,
                accentText,
                order: item.order!,
                showOnTeam: item.show_on_team === true,
            };
        })
        .filter((item): item is Member => item !== null)
        .sort((a, b) => a.order - b.order);
}
