import {
    cockpit,
    type CockpitAsset,
    cockpitAssetUrl,
} from "../../lib/api/cockpit";

export type LauncherThemeId = "green" | "brass" | "ocean";

export type LauncherImageKey =
    | "play"
    | "instances"
    | "content"
    | "skins"
    | "worlds"
    | "servers"
    | "export"
    | "sharing"
    | "command";

export type LauncherThemeImages = Record<LauncherImageKey, string>;
export type LauncherThemeAssets = {
    heroBg: string;
    closingBg: string;
    images: LauncherThemeImages;
};
export type LauncherAssets = Partial<
    Record<LauncherThemeId, LauncherThemeAssets>
>;

type CockpitLauncherImages = {
    herobg?: CockpitAsset | null;
    closingbg?: CockpitAsset | null;
    play_screen?: CockpitAsset | null;
    instances?: CockpitAsset | null;
    content?: CockpitAsset | null;
    skin_selector?: CockpitAsset | null;
    worlds?: CockpitAsset | null;
    servers?: CockpitAsset | null;
    export_menu?: CockpitAsset | null;
    sharing_menu?: CockpitAsset | null;
    command_palette?: CockpitAsset | null;
};

type CockpitSelectValue =
    string | string[] | { label?: string; value?: string } | null;

type CockpitLauncherAssets = {
    theme?: CockpitSelectValue;
    images?: CockpitLauncherImages | CockpitLauncherImages[] | null;
    active?: boolean | number | string;
};

function isLauncherTheme(value: string): value is LauncherThemeId {
    return value === "green" || value === "brass" || value === "ocean";
}

function getThemeValue(value: CockpitSelectValue | undefined) {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value[0] ?? "";
    return value?.value ?? value?.label ?? "";
}

function getImageSet(
    value: CockpitLauncherAssets["images"],
): CockpitLauncherImages {
    if (Array.isArray(value)) return value[0] ?? {};
    return value ?? {};
}

function isActive(value: CockpitLauncherAssets["active"]) {
    return value !== false && value !== 0 && value !== "0" && value !== "false";
}

function resolveImages(
    images: CockpitLauncherImages,
): LauncherThemeImages | null {
    const resolved = {
        play: cockpitAssetUrl(images.play_screen),
        instances: cockpitAssetUrl(images.instances),
        content: cockpitAssetUrl(images.content),
        skins: cockpitAssetUrl(images.skin_selector),
        worlds: cockpitAssetUrl(images.worlds),
        servers: cockpitAssetUrl(images.servers),
        export: cockpitAssetUrl(images.export_menu),
        sharing: cockpitAssetUrl(images.sharing_menu),
        command: cockpitAssetUrl(images.command_palette),
    };

    if (Object.values(resolved).some((source) => !source)) return null;

    return resolved as LauncherThemeImages;
}

export async function getLauncherAssets(): Promise<LauncherAssets> {
    const items = await cockpit.items<CockpitLauncherAssets>("launcherassets");
    const result: LauncherAssets = {};

    items.forEach((item) => {
        const theme = getThemeValue(item.theme).trim().toLowerCase();
        const images = getImageSet(item.images);
        const heroBg = cockpitAssetUrl(images.herobg);
        const closingBg = cockpitAssetUrl(images.closingbg);
        const resolvedImages = resolveImages(images);

        if (
            !isActive(item.active) ||
            !isLauncherTheme(theme) ||
            !heroBg ||
            !closingBg ||
            !resolvedImages
        ) {
            return;
        }

        result[theme] = {
            heroBg,
            closingBg,
            images: resolvedImages,
        };
    });

    return result;
}
