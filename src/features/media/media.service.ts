import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

export type MediaCollection = "director" | "library";

export type MediaVideo = {
    id: string;
    youtubeId: string;
    title: string;
    channel: string;
    duration: string;
    href: string;
    thumbnail: string;
    collection: MediaCollection;
};

type CockpitMediaVideo = {
    _id: string;
    youtube_id?: string;
    title?: string;
    channel?: string;
    duration?: string;
    href?: string;
    thumbnail?: CockpitAsset | null;
    collection?: string;
    active?: boolean | number | string;
};

function isEnabled(value: boolean | number | string | undefined): boolean {
    if (value === undefined) return true;
    if (value === false || value === 0) return false;

    return !["0", "false"].includes(String(value).trim().toLowerCase());
}

export async function getMediaVideos(): Promise<MediaVideo[]> {
    const items = await cockpit.items<CockpitMediaVideo>("mediavideos", {
        sort: { _id: -1 },
    });

    return items
        .filter((item) => isEnabled(item.active))
        .map((item): MediaVideo | null => {
            const title = item.title?.trim();
            const youtubeId = item.youtube_id?.trim();
            const href = item.href?.trim();
            const channel = item.channel?.trim();
            const duration = item.duration?.trim();
            const thumbnail = cockpitAssetUrl(item.thumbnail);
            const collection = item.collection?.trim();

            if (
                !title ||
                !youtubeId ||
                !href ||
                !channel ||
                !duration ||
                !thumbnail ||
                (collection !== "director" && collection !== "library")
            )
                return null;

            return {
                id: item._id,
                youtubeId,
                title,
                channel,
                duration,
                href,
                thumbnail,
                collection,
            };
        })
        .filter((item): item is MediaVideo => item !== null)
        .sort((a, b) => b.id.localeCompare(a.id));
}
