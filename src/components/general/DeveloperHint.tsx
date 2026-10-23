import { useEffect } from "react";

const DEVELOPER_HINT_MARKER = "Found your way into the source?";
const DEVELOPER_HINT = `
Found your way into the source?
We are always looking for developers who enjoy building ambitious things.
Interested in joining us? Visit https://discord.gg/brassworks and apply now! :P
`;

export function DeveloperHint() {
    useEffect(() => {
        const existingHint = Array.from(
            document.documentElement.childNodes,
        ).find(
            (node) =>
                node.nodeType === Node.COMMENT_NODE &&
                node.textContent?.includes(DEVELOPER_HINT_MARKER),
        );

        if (existingHint) return;

        const hint = document.createComment(DEVELOPER_HINT);

        document.documentElement.insertBefore(hint, document.head);

        return () => hint.remove();
    }, []);

    return null;
}
