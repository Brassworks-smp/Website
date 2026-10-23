import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

type CockpitHomepageAssets = {
    mods_cover?: CockpitAsset | null;
    modpack_video?: CockpitAsset | null;
    modpack_cover?: CockpitAsset | null;
    modpack_logo?: CockpitAsset | null;
    modpack2_cover?: CockpitAsset | null;
};

export type HomepageAssets = {
    modsCover: string | null;
    modpackVideo: string | null;
    modpackCover: string | null;
    modpackLogo: string | null;
    modpack2Cover: string | null;
};

export async function getHomepageAssets(): Promise<HomepageAssets> {
    const item =
        await cockpit.singleton<CockpitHomepageAssets>("homepageassets");

    return {
        modsCover: cockpitAssetUrl(item.mods_cover),
        modpackVideo: cockpitAssetUrl(item.modpack_video),
        modpackCover: cockpitAssetUrl(item.modpack_cover),
        modpackLogo: cockpitAssetUrl(item.modpack_logo),
        modpack2Cover: cockpitAssetUrl(item.modpack2_cover),
    };
}
