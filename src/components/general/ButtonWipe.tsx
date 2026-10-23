type ButtonWipeProps = {
    tone?: "primary" | "secondary";
    color?: string;
};

export function ButtonWipe({ tone = "primary", color }: ButtonWipeProps) {
    return (
        <span
            className="site-button-wipe pointer-events-none absolute inset-y-0 -left-1/3 w-[140%] -translate-x-full -skew-x-[24deg] transition-transform group-hover/button:translate-x-0"
            style={{
                backgroundColor:
                    color ??
                    (tone === "secondary"
                        ? "var(--site-accent-secondary, #d9b86e)"
                        : "var(--site-accent-hover, #dec17c)"),
            }}
            aria-hidden="true"
        />
    );
}
