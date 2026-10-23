import {
    Braces,
    Code2,
    Globe,
    Hammer,
    type LucideIcon,
    Play,
    Shield,
    Sparkles,
    Wrench,
} from "lucide-react";

export const DISCORD_URL = "https://discord.gg/brassworks";
export const REVIEW_TIME = "7-14 days";
export const APPLICATION_DURATION = "10-20 min";

export type JoinPositionStatus = "open" | "closed";

export type JoinPositionGroup = "team" | "community";

export type JoinPosition = {
    id: string;
    title: string;
    rank: string;
    area: string;
    group: JoinPositionGroup;
    summary: string;
    description: string;
    responsible: string;
    tasks: string[];
    requirements: string[];
    optional: string[];
    status: JoinPositionStatus;
    icon: LucideIcon;
};

export const joinPositions: JoinPosition[] = [
    {
        id: "development",
        title: "Development Team",
        rank: "Team",
        area: "Development",
        group: "team",
        summary:
            "Develops mods, plugins, integrations, and other software used by Brassworks.",
        description:
            "Develops mods, plugins, integrations, and other software used by Brassworks.",
        responsible: "DerErneuerer",
        tasks: [
            "Build and maintain Brassworks mods and plugins",
            "Work on integrations between our tools and services",
            "Fix bugs and review changes from other team members",
            "Keep projects up to date with new Minecraft and loader versions",
        ],
        requirements: [
            "Experience with Java, Kotlin, or a similar language",
            "Basic understanding of Minecraft modding or plugin development",
            "Willingness to work with Git and code reviews",
        ],
        optional: [
            "Experience with NeoForge, Fabric, or Paper",
            "Experience with Create or Create addons",
            "Public projects or a GitHub profile - not required",
        ],
        status: "open",
        icon: Code2,
    },
    {
        id: "web-development",
        title: "Web Development",
        rank: "Team",
        area: "Development",
        group: "team",
        summary:
            "Develops and maintains websites, dashboards, and other web applications.",
        description:
            "Develops and maintains websites, dashboards, and other web applications.",
        responsible: "DerErneuerer",
        tasks: [
            "Develop and maintain the Brassworks website",
            "Work on dashboards and internal tools",
            "Build and connect APIs and databases",
            "Keep our web applications secure and fast",
        ],
        requirements: [
            "Experience with HTML, CSS, and JavaScript or TypeScript",
            "Experience with at least one frontend or backend framework",
            "Basic understanding of APIs",
        ],
        optional: [
            "React, TanStack, or similar frameworks",
            "Experience with databases and authentication",
            "Own websites or web applications",
        ],
        status: "open",
        icon: Braces,
    },
    {
        id: "content",
        title: "Content Team",
        rank: "Team",
        area: "Content",
        group: "team",
        summary:
            "Works on gameplay content, news, balancing, quests, lore, and other project content.",
        description:
            "Works on gameplay content, news, balancing, quests, lore, and other project content.",
        responsible: "DerErneuerer",
        tasks: [
            "Create gameplay content such as quests and progression",
            "Write news, lore, and in-game texts",
            "Balance recipes, configs, and progression",
            "Test new content together with the team",
        ],
        requirements: [
            "Good written English",
            "Understanding of Minecraft gameplay and modpacks",
            "Ability to give and take feedback",
        ],
        optional: [
            "Experience with KubeJS, FTB Quests, or similar tools",
            "Previous writing or game design work",
            "Knowledge of Create",
        ],
        status: "open",
        icon: Sparkles,
    },
    {
        id: "media",
        title: "Media Team",
        rank: "Team",
        area: "Media",
        group: "team",
        summary:
            "Handles all media-related work for Brassworks, including animations, music, sound design, videos, and other audiovisual content.",
        description:
            "Handles all media-related work for Brassworks, including animations, music, sound design, videos, and other audiovisual content.",
        responsible: "DerErneuerer, Media Director SnowGo",
        tasks: [
            "Create animations, trailers, and videos",
            "Produce music and sound design",
            "Work on other audiovisual content for our projects",
            "Collaborate with our Media Director SnowGo",
        ],
        requirements: [
            "Experience in at least one media area",
            "Familiarity with the programs you work with",
            "Reliable communication about timelines",
        ],
        optional: [
            "A portfolio or previous work",
            "Experience with Minecraft content",
            "Experience with Blender, DaVinci Resolve, or a DAW",
        ],
        status: "open",
        icon: Play,
    },
    {
        id: "moderator",
        title: "Moderator",
        rank: "Moderator",
        area: "Moderation",
        group: "community",
        summary:
            "Moderators handle support requests, reports, rule enforcement, and community-related incidents.",
        description:
            "Moderators handle support requests, reports, rule enforcement, and community-related incidents. They are the main public contact for support and may involve Administration when necessary.",
        responsible: "Administration",
        tasks: [
            "Answer support requests and handle reports",
            "Enforce the rules fairly and consistently",
            "Calm down conflicts between players",
            "Escalate cases to Administration when necessary",
        ],
        requirements: [
            "Good understanding of our rules",
            "Neutral and calm communication",
            "Careful handling of evidence and permissions",
        ],
        optional: [
            "Previous moderation experience",
            "Experience with Brassworks or Create",
            "Availability in less covered time zones",
        ],
        status: "open",
        icon: Shield,
    },
    {
        id: "assistant",
        title: "Assistant",
        rank: "Assistant",
        area: "Administration",
        group: "community",
        summary:
            "Assistants directly support Administration with technical and operational tasks.",
        description:
            "Assistants directly support Administration with technical and operational tasks. Their responsibilities include testing projects, finding and reproducing bugs, investigating problems, and handling quick fixes for crashes or other urgent issues when an Administrator is unavailable. Player support may also be handled when needed, but it is not the main responsibility of the rank.",
        responsible: "Administration",
        tasks: [
            "Test projects and updates before release",
            "Find, reproduce, and document bugs",
            "Investigate crashes and other problems",
            "Apply quick fixes when no Administrator is available",
        ],
        requirements: [
            "Basic technical understanding of Minecraft servers and modpacks",
            "Structured troubleshooting",
            "Clear documentation and knowing when to escalate",
        ],
        optional: [
            "Experience with Linux or server hosting",
            "Reading crash reports and logs",
            "Previous QA or support work",
        ],
        status: "open",
        icon: Wrench,
    },
    {
        id: "builder",
        title: "Builder",
        rank: "Builder",
        area: "Building",
        group: "community",
        summary: "Builders work on Brassworks building projects.",
        description:
            "Builders work on Brassworks building projects. Builder is a separate role and does not automatically represent Team membership.",
        responsible: "Builder Lead Float420",
        tasks: [
            "Build spawns, structures, and shared projects",
            "Work together with other builders on larger projects",
            "Follow the style of a project",
            "Prepare builds for use on our servers",
        ],
        requirements: [
            "Building experience in Minecraft",
            "Ability to work on shared projects",
            "Availability for joint building sessions",
        ],
        optional: [
            "Screenshots or a portfolio",
            "Experience with WorldEdit, Axiom, or similar tools",
            "Experience with Create builds",
        ],
        status: "open",
        icon: Hammer,
    },
];

export function findJoinPosition(id: string) {
    return joinPositions.find((position) => position.id === id) ?? null;
}

export const joinGroups: Array<{
    id: JoinPositionGroup;
    title: string;
    description: string;
    icon: LucideIcon;
}> = [
    {
        id: "team",
        title: "Team",
        description: "Development, web, content, and media.",
        icon: Code2,
    },
    {
        id: "community",
        title: "Community & Server",
        description: "Moderation, administration support, and building.",
        icon: Globe,
    },
];
