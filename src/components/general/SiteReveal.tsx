import { useEffect } from "react";

function markLoaded(target: EventTarget | null) {
    if (target instanceof HTMLImageElement) {
        target.dataset.loaded = "true";
    }
}

export function SiteReveal() {
    useEffect(() => {
        const handleLoad = (event: Event) => markLoaded(event.target);

        document.querySelectorAll("img").forEach((image) => {
            if (image.complete) markLoaded(image);
        });
        document.addEventListener("load", handleLoad, true);
        document.addEventListener("error", handleLoad, true);
        document.documentElement.dataset.imageReveal = "true";

        return () => {
            document.removeEventListener("load", handleLoad, true);
            document.removeEventListener("error", handleLoad, true);
            delete document.documentElement.dataset.imageReveal;
        };
    }, []);

    return null;
}
