import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

type CockpitFonts = {
    minecraft_regular?: CockpitAsset | null;
    minecraft_bold?: CockpitAsset | null;
    minecraft_italic?: CockpitAsset | null;
};

export type CmsFonts = {
    minecraftRegular: string | null;
    minecraftBold: string | null;
    minecraftItalic: string | null;
};

export async function getCmsFonts(): Promise<CmsFonts> {
    const item = await cockpit.singleton<CockpitFonts>("fonts");

    return {
        minecraftRegular: cockpitAssetUrl(item.minecraft_regular),
        minecraftBold: cockpitAssetUrl(item.minecraft_bold),
        minecraftItalic: cockpitAssetUrl(item.minecraft_italic),
    };
}
