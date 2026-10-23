const LATEST_RELEASE_API =
    "https://api.github.com/repos/Brassworks-smp/BrassworksLauncher/releases/latest";

export type LauncherReleaseAsset = {
    name: string;
    url: string;
    size: number;
    contentType: string;
};

export type LauncherRelease = {
    version: string;
    name: string;
    url: string;
    publishedAt: string;
    assets: LauncherReleaseAsset[];
};

type GitHubReleaseAsset = {
    name?: string;
    browser_download_url?: string;
    size?: number;
    content_type?: string;
};

type GitHubRelease = {
    tag_name?: string;
    name?: string;
    html_url?: string;
    published_at?: string;
    assets?: GitHubReleaseAsset[];
};

export async function getLatestLauncherRelease(): Promise<LauncherRelease> {
    const response = await fetch(LATEST_RELEASE_API, {
        headers: {
            Accept: "application/vnd.github+json",
        },
    });

    if (!response.ok) {
        throw new Error(
            `GitHub release request failed with ${response.status}`,
        );
    }

    const release = (await response.json()) as GitHubRelease;
    const tag = release.tag_name?.trim();
    const url = release.html_url?.trim();

    if (!tag || !url) {
        throw new Error("GitHub returned an incomplete launcher release");
    }

    return {
        version: tag.replace(/^v/i, ""),
        name: release.name?.trim() || tag,
        url,
        publishedAt: release.published_at?.trim() || "",
        assets: (release.assets ?? [])
            .map((asset) => {
                const name = asset.name?.trim();
                const assetUrl = asset.browser_download_url?.trim();

                if (!name || !assetUrl) return null;

                return {
                    name,
                    url: assetUrl,
                    size: asset.size ?? 0,
                    contentType:
                        asset.content_type?.trim() ||
                        "application/octet-stream",
                };
            })
            .filter((asset): asset is LauncherReleaseAsset => asset !== null),
    };
}
