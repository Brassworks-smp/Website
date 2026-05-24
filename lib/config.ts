// components/general/hero-section.tsx
export const HERO_CONTENT = {
    url: "https://modrinth.com/server/brassworks-smp-official-server",

    button: {
        width: 230,
        height: 100,
        alt: "Join Brassworks",

        frames: 5,
        animationSpeed: 100,

        defaultFrame: (frame: number) =>
            `/buttons/hero-button/button${frame}.png`,

        clickedFrame: (frame: number) =>
            `/buttons/hero-button/clicked_button${frame}.png`,
    },

    seasonLogo: {
        src: "/images/seasons/season2.png",
        alt: "brassworks-season2",

        width: 100,
        height: 100,
    },

    background: {
        video: "/videos/background.mp4",
    },
};

// components/roadmap/roadmap.tsx.ts
export const ROADMAP_CONTENT = {
    title: "Modpack Roadmap",
    versionLabel: "Version",
    currentLabel: "Current",

    background: {
        video: "/videos/background.mp4",
    },

    fallback: {
        currentVersion: "...",
        subcategory: "General",
        description: "No description provided.",
        assignee: "Unassigned",
    },

    imagePreview: {
        alt: "Preview",
        closeLabel: "Close preview",
    },

    layout: {
        visibleVersions: 4,
    },
} as const;