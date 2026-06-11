const GITHUB_REPO = "Brassworks-smp/BrassworksLauncher";
const RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases`;

export type ReleaseAsset = { name: string; url: string; size: number };

export type DownloadLink = {
    label: string;
    url: string;
    size?: number;
};

export type LauncherRelease = {
    version: string;
    tag: string;
    htmlUrl: string;
    publishedAt: string | null;
    mac: {
        universal?: DownloadLink;
    };
    windows: {
        x64Msi?: DownloadLink;
        x64Exe?: DownloadLink;
        arm64Msi?: DownloadLink;
        arm64Exe?: DownloadLink;
    };
    linux: {
        x64Deb?: DownloadLink;
        arm64Deb?: DownloadLink;
        x64Rpm?: DownloadLink;
        arm64Rpm?: DownloadLink;
        x64AppImage?: DownloadLink;
        arm64AppImage?: DownloadLink;
    };
};

function toLink(asset: ReleaseAsset | undefined, label: string): DownloadLink | undefined {
    if (!asset) return undefined;
    return { label, url: asset.url, size: asset.size };
}

function mapAssets(assets: ReleaseAsset[]) {
    const installers = assets.filter(
        (a) => !a.name.endsWith(".sig") && a.name !== "latest.json"
    );
    const find = (re: RegExp) => installers.find((a) => re.test(a.name));

    return {
        mac: {
            universal: toLink(find(/_universal\.dmg$/), "macOS — Universal (Intel & Apple Silicon)"),
        },
        windows: {
            x64Msi: toLink(find(/_x64[_-].*\.msi$/), "Windows x64 — Installer (.msi)"),
            x64Exe: toLink(find(/_x64-setup\.exe$/), "Windows x64 — Setup (.exe)"),
            arm64Msi: toLink(find(/_arm64[_-].*\.msi$/), "Windows ARM64 — Installer (.msi)"),
            arm64Exe: toLink(find(/_arm64-setup\.exe$/), "Windows ARM64 — Setup (.exe)"),
        },
        linux: {
            x64Deb: toLink(find(/_amd64\.deb$/), "Debian / Ubuntu x86_64 (.deb)"),
            arm64Deb: toLink(find(/_arm64\.deb$/), "Debian / Ubuntu ARM64 (.deb)"),
            x64Rpm: toLink(find(/\.x86_64\.rpm$/), "Fedora / RHEL x86_64 (.rpm)"),
            arm64Rpm: toLink(find(/\.aarch64\.rpm$/), "Fedora / RHEL ARM64 (.rpm)"),
            x64AppImage: toLink(find(/_amd64\.AppImage$/), "Portable x86_64 (.AppImage)"),
            arm64AppImage: toLink(find(/_aarch64\.AppImage$/), "Portable ARM64 (.AppImage)"),
        },
    };
}

export async function getLatestLauncherRelease(): Promise<LauncherRelease | null> {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
            {
                headers: { Accept: "application/vnd.github+json" },
                next: { revalidate: 3600 },
            }
        );
        if (!res.ok) return null;

        const data = await res.json();
        const assets: ReleaseAsset[] = (data.assets ?? []).map((a: any) => ({
            name: a.name as string,
            url: a.browser_download_url as string,
            size: a.size as number,
        }));

        const tag: string = data.tag_name ?? "";
        const mapped = mapAssets(assets);

        return {
            version: tag.replace(/^v/, ""),
            tag,
            htmlUrl: data.html_url ?? RELEASES_PAGE,
            publishedAt: data.published_at ?? null,
            ...mapped,
        };
    } catch {
        return null;
    }
}

export const LAUNCHER_RELEASES_URL = RELEASES_PAGE;
