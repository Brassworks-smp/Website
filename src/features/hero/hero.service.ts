import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

export type SlideLogo = {
    source: string;
    alt: string;
};

export type Slide = {
    id: string;
    title: string;
    subtitle: string;
    video: string;
    thumbnail: string | null;
    logo: SlideLogo | null;
    href: string;
};

type CockpitHeroSlide = {
    _id: string;
    title: string;
    subtitle: string;
    video: CockpitAsset;
    thumbnail?: CockpitAsset | null;
    logo?: CockpitAsset | null;
    logo_alt?: string;
    href: string;
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

function mapSlide(item: CockpitHeroSlide): Slide | null {
    const video = cockpitAssetUrl(item.video);
    const href = item.href?.trim();
    const title = item.title?.trim();
    const subtitle = item.subtitle?.trim();

    if (!item._id || !title || !subtitle || !video || !href) return null;

    const logoSource = cockpitAssetUrl(item.logo);
    const logoAlt = item.logo_alt?.trim();

    return {
        id: item._id,
        title,
        subtitle,
        video,
        thumbnail: cockpitAssetUrl(item.thumbnail),
        logo:
            logoSource && logoAlt
                ? {
                      source: logoSource,
                      alt: logoAlt,
                  }
                : null,
        href,
    };
}

export async function getHeroSlides(): Promise<Slide[]> {
    const items = await cockpit.items<CockpitHeroSlide>("heroslides");

    return items
        .filter((item) => isEnabled(item.active))
        .sort((a, b) => itemOrder(a.order) - itemOrder(b.order))
        .map(mapSlide)
        .filter((slide): slide is Slide => slide !== null)
        .slice(0, 5);
}
