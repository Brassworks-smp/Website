export type ApplicationAnswer = string | string[];

export type ApplicationAnswers = Record<string, ApplicationAnswer>;

type BaseField = {
    id: string;
    label: string;
    hint?: string;
    required?: boolean;
    showWhen?: { field: string; equals: string };
};

export type ApplicationField =
    | (BaseField & {
          type: "text";
          placeholder?: string;
          maxLength: number;
          pattern?: RegExp;
          patternMessage?: string;
          autoComplete?: string;
          inputMode?: "text" | "numeric" | "url";
      })
    | (BaseField & {
          type: "timezone";
      })
    | (BaseField & {
          type: "textarea";
          placeholder?: string;
          maxLength: number;
          rows?: number;
      })
    | (BaseField & {
          type: "select" | "radio" | "choices";
          options: string[];
      });

export type ApplicationSection = {
    id: string;
    title: string;
    description?: string;
    fields: ApplicationField[];
};

export type ApplicationForm = {
    version: number;
    sections: ApplicationSection[];
};

const contactSection: ApplicationSection = {
    id: "contact",
    title: "Discord contact",
    description:
        "Please check your Discord username and user ID carefully. If we cannot reach you using the provided information, your application will be closed.",
    fields: [
        {
            id: "discordUsername",
            type: "text",
            label: "Discord username",
            placeholder: "exampleuser",
            maxLength: 37,
            pattern: /^[a-zA-Z0-9._]{2,32}(#\d{4})?$/,
            patternMessage:
                "Use your Discord username, for example exampleuser.",
            autoComplete: "username",
            required: true,
        },
        {
            id: "discordId",
            type: "text",
            label: "Discord user ID",
            hint: "Enable Developer Mode in Discord, then right-click your name and choose Copy User ID.",
            placeholder: "123456789012345678",
            maxLength: 20,
            pattern: /^\d{17,20}$/,
            patternMessage: "A Discord user ID has 17 to 20 digits.",
            inputMode: "numeric",
            required: true,
        },
    ],
};

const aboutSection: ApplicationSection = {
    id: "about",
    title: "About you",
    fields: [
        {
            id: "timezone",
            type: "timezone",
            label: "Time zone",
            required: true,
        },
        {
            id: "languages",
            type: "text",
            label: "Languages you speak",
            placeholder: "English, German",
            maxLength: 120,
            required: true,
        },
        {
            id: "availability",
            type: "select",
            label: "Approximate availability",
            options: [
                "A few hours per month",
                "A few hours per week",
                "Several hours per week",
                "Most days",
                "It varies a lot",
            ],
            required: true,
        },
        {
            id: "experience",
            type: "textarea",
            label: "Relevant experience",
            hint: "What have you done before that fits this position?",
            maxLength: 1500,
            rows: 5,
            required: true,
        },
        {
            id: "motivation",
            type: "textarea",
            label: "Why do you want to join?",
            hint: "A few sentences are enough.",
            maxLength: 800,
            rows: 4,
            required: true,
        },
    ],
};

const communitySection: ApplicationSection = {
    id: "community",
    title: "You and Brassworks",
    fields: [
        {
            id: "minecraftName",
            type: "text",
            label: "Minecraft name",
            maxLength: 16,
            pattern: /^\w{3,16}$/,
            patternMessage:
                "A Minecraft name has 3 to 16 letters, digits, or underscores.",
            required: true,
        },
        {
            id: "brassworksExperience",
            type: "radio",
            label: "Experience with Brassworks",
            options: [
                "New to Brassworks",
                "Played a little",
                "Regular player",
                "Long-time player",
            ],
            required: true,
        },
        {
            id: "knownProjects",
            type: "textarea",
            label: "Projects or modpacks you know",
            hint: "Brassworks projects, Create, or other modpacks you have played.",
            maxLength: 600,
            rows: 3,
        },
        {
            id: "previousSanctions",
            type: "radio",
            label: "Have you ever been banned or sanctioned on Brassworks or another community?",
            options: ["No", "Yes"],
            required: true,
        },
        {
            id: "previousSanctionsDetails",
            type: "textarea",
            label: "What happened?",
            hint: "Being honest here does not rule you out.",
            maxLength: 800,
            rows: 3,
            required: true,
            showWhen: { field: "community.previousSanctions", equals: "Yes" },
        },
        {
            id: "similarRoles",
            type: "textarea",
            label: "Similar roles you have held",
            hint: "For example moderator, support, or builder on another server.",
            maxLength: 800,
            rows: 3,
        },
    ],
};

const teamSection: ApplicationSection = {
    id: "work",
    title: "Your work",
    fields: [
        {
            id: "technologies",
            type: "textarea",
            label: "Technologies or programs you use",
            maxLength: 600,
            rows: 3,
            required: true,
        },
        {
            id: "portfolio",
            type: "textarea",
            label: "Portfolio, GitHub, or work examples",
            hint: "One link per line, if you have any. This is not required.",
            maxLength: 800,
            rows: 3,
        },
        {
            id: "preferredTasks",
            type: "textarea",
            label: "Tasks you would like to work on",
            maxLength: 600,
            rows: 3,
            required: true,
        },
        {
            id: "ownProject",
            type: "textarea",
            label: "Describe a project you built yourself",
            hint: "What was it, what was your part, and what did you learn?",
            maxLength: 1500,
            rows: 5,
            required: true,
        },
    ],
};

const roleSections: Record<string, ApplicationSection> = {
    development: {
        id: "development",
        title: "Development",
        fields: [
            {
                id: "languages",
                type: "text",
                label: "Programming languages",
                placeholder: "Java, Kotlin, ...",
                maxLength: 200,
                required: true,
            },
            {
                id: "modloaders",
                type: "choices",
                label: "Modloaders and platforms you have worked with",
                options: [
                    "NeoForge",
                    "Forge",
                    "Fabric",
                    "Quilt",
                    "Paper / Spigot",
                    "None yet",
                ],
                required: true,
            },
            {
                id: "minecraftVersions",
                type: "text",
                label: "Minecraft versions you have worked with",
                placeholder: "1.20.1, 1.21.1",
                maxLength: 120,
            },
            {
                id: "git",
                type: "radio",
                label: "Experience with Git and working together",
                options: ["None", "Basic", "Comfortable", "Advanced"],
                required: true,
            },
            {
                id: "problemSolving",
                type: "textarea",
                label: "A player reports a crash that you cannot reproduce. How do you approach it?",
                maxLength: 1200,
                rows: 5,
                required: true,
            },
            {
                id: "codeSample",
                type: "textarea",
                label: "No public work? Share a short code example or explain a project instead",
                maxLength: 2000,
                rows: 5,
            },
        ],
    },
    "web-development": {
        id: "web",
        title: "Web Development",
        fields: [
            {
                id: "focus",
                type: "radio",
                label: "Preferred area",
                options: ["Frontend", "Backend", "Full stack"],
                required: true,
            },
            {
                id: "frameworks",
                type: "text",
                label: "Frameworks you have used",
                placeholder: "React, Vue, Express, ...",
                maxLength: 200,
                required: true,
            },
            {
                id: "dataAndApis",
                type: "text",
                label: "Databases and APIs you have worked with",
                maxLength: 200,
            },
            {
                id: "websites",
                type: "textarea",
                label: "Websites or applications you built",
                hint: "One link per line, or a short description.",
                maxLength: 800,
                rows: 3,
            },
            {
                id: "security",
                type: "textarea",
                label: "Experience with security and authentication",
                maxLength: 800,
                rows: 3,
            },
        ],
    },
    content: {
        id: "content",
        title: "Content",
        fields: [
            {
                id: "contentAreas",
                type: "choices",
                label: "Content you have worked on",
                options: [
                    "Gameplay content",
                    "Quests",
                    "Lore",
                    "News and writing",
                    "Balancing",
                    "Configs",
                ],
                required: true,
            },
            {
                id: "preferredArea",
                type: "select",
                label: "Preferred content area",
                options: [
                    "Gameplay content",
                    "Quests",
                    "Lore",
                    "News and writing",
                    "Balancing and configs",
                ],
                required: true,
            },
            {
                id: "examples",
                type: "textarea",
                label: "Examples of your work",
                hint: "Links or a short description, if you have any.",
                maxLength: 800,
                rows: 3,
            },
            {
                id: "sample",
                type: "textarea",
                label: "Short sample: describe a quest or a small piece of lore for a Create modpack",
                hint: "Keep it short - a few sentences are enough.",
                maxLength: 1000,
                rows: 5,
            },
        ],
    },
    media: {
        id: "media",
        title: "Media",
        fields: [
            {
                id: "mediaAreas",
                type: "choices",
                label: "Media areas",
                options: [
                    "Animation",
                    "Music",
                    "Sound design",
                    "Video",
                    "Other audiovisual work",
                ],
                required: true,
            },
            {
                id: "programs",
                type: "text",
                label: "Programs you use",
                placeholder: "Blender, DaVinci Resolve, FL Studio, ...",
                maxLength: 200,
                required: true,
            },
        ],
    },
    moderator: {
        id: "moderator",
        title: "Situations",
        description:
            "There are no perfect answers. We want to understand how you think and communicate.",
        fields: [
            {
                id: "accusations",
                type: "textarea",
                label: "Two players accuse each other of griefing. How do you handle it?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "friend",
                type: "textarea",
                label: "A friend of yours breaks a rule. What do you do?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "evidence",
                type: "textarea",
                label: "A report contains incomplete evidence. How do you proceed?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "discussion",
                type: "textarea",
                label: "A player keeps arguing after your decision. How do you respond?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "escalation",
                type: "textarea",
                label: "When would you hand a case over to Administration?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
        ],
    },
    assistant: {
        id: "assistant",
        title: "Technical situations",
        description:
            "There are no perfect answers. We want to understand how you troubleshoot and when you escalate.",
        fields: [
            {
                id: "technicalBackground",
                type: "textarea",
                label: "Your technical background",
                hint: "Servers, modpacks, Linux, logs, or anything else that fits.",
                maxLength: 800,
                rows: 3,
                required: true,
            },
            {
                id: "repeatedCrash",
                type: "textarea",
                label: "A server or modpack crashes repeatedly. What are your first steps?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "notReproducible",
                type: "textarea",
                label: "A bug cannot be reproduced reliably. How do you continue?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "noAdmin",
                type: "textarea",
                label: "A problem occurs while no Administrator is available. What do you do?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
            {
                id: "misuse",
                type: "textarea",
                label: "How do you find out whether an issue is a bug or caused by wrong usage?",
                maxLength: 800,
                rows: 4,
                required: true,
            },
        ],
    },
    builder: {
        id: "builder",
        title: "Building",
        fields: [
            {
                id: "buildingExperience",
                type: "textarea",
                label: "Your building experience",
                maxLength: 1200,
                rows: 4,
                required: true,
            },
            {
                id: "styles",
                type: "choices",
                label: "Preferred building styles",
                options: [
                    "Medieval",
                    "Modern",
                    "Industrial / Create",
                    "Fantasy",
                    "Steampunk",
                    "Organics",
                    "Terraforming",
                    "Interiors",
                ],
                required: true,
            },
            {
                id: "tools",
                type: "choices",
                label: "Building tools you use",
                options: [
                    "WorldEdit",
                    "Axiom",
                    "VoxelSniper",
                    "Litematica",
                    "None",
                ],
                required: true,
            },
            {
                id: "screenshots",
                type: "textarea",
                label: "Screenshots or portfolio",
                hint: "One link per line, if you have any.",
                maxLength: 800,
                rows: 3,
            },
            {
                id: "jointProjects",
                type: "radio",
                label: "Availability for joint building sessions",
                options: ["Rarely", "Sometimes", "Often"],
                required: true,
            },
        ],
    },
};

const formVersions: Record<string, number> = {
    development: 1,
    "web-development": 1,
    content: 1,
    media: 1,
    moderator: 1,
    assistant: 1,
    builder: 1,
};

const communityPositions = new Set(["moderator", "assistant", "builder"]);

export function getApplicationForm(positionId: string): ApplicationForm {
    const roleSection = roleSections[positionId];
    const sections = [
        contactSection,
        aboutSection,
        communityPositions.has(positionId) ? communitySection : teamSection,
        ...(roleSection ? [roleSection] : []),
    ];

    return {
        version: formVersions[positionId] ?? 1,
        sections,
    };
}

export function isFieldVisible(
    field: ApplicationField,
    answers: ApplicationAnswers,
) {
    return (
        !field.showWhen ||
        answers[field.showWhen.field] === field.showWhen.equals
    );
}

export function fieldKey(section: ApplicationSection, field: ApplicationField) {
    return `${section.id}.${field.id}`;
}
