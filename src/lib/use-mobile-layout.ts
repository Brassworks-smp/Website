import { useSyncExternalStore } from "react";

const MOBILE_LAYOUT_QUERY = "(max-width: 1023px)";
const HANDHELD_AGENT = /Android|iPhone|iPad|iPod/i;

function subscribe(onChange: () => void) {
    const media = window.matchMedia(MOBILE_LAYOUT_QUERY);

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
}

function subscribeOnce() {
    return () => {};
}

function getSnapshot() {
    return window.matchMedia(MOBILE_LAYOUT_QUERY).matches;
}

function getHandheldSnapshot() {
    return (
        HANDHELD_AGENT.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
    );
}

function getServerSnapshot() {
    return false;
}

export function useMobileLayout() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useHandheldDevice() {
    return useSyncExternalStore(
        subscribeOnce,
        getHandheldSnapshot,
        getServerSnapshot,
    );
}
