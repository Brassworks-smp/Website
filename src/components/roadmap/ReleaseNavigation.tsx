import {
    Check,
    FlaskConical,
    LoaderCircle,
    type LucideIcon,
    Timer,
} from "lucide-react";
import type {
    RoadmapItem,
    RoadmapItemStatus,
} from "../../features/roadmap/roadmap.service";

const statusConfig: Array<{
    id: RoadmapItemStatus;
    label: string;
    icon: LucideIcon;
}> = [
    { id: "planned", label: "Planned", icon: Timer },
    { id: "in_progress", label: "In Progress", icon: LoaderCircle },
    { id: "testing", label: "Testing & Review", icon: FlaskConical },
    { id: "done", label: "Done", icon: Check },
    { id: "released", label: "Released", icon: Check },
];

type ReleaseNavigationProps = {
    items: RoadmapItem[];
    activeStatus: RoadmapItemStatus;
    accent: string;
    onSelect: (status: RoadmapItemStatus) => void;
};

export function ReleaseNavigation({
    items,
    activeStatus,
    accent,
    onSelect,
}: ReleaseNavigationProps) {
    return (
        <nav
            className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5"
            aria-label="Roadmap status"
        >
            {statusConfig.map((status) => {
                const active = status.id === activeStatus;
                const StatusIcon = status.icon;
                const itemCount = items.filter(
                    (item) => item.status === status.id,
                ).length;

                return (
                    <button
                        key={status.id}
                        type="button"
                        onClick={() => onSelect(status.id)}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 bg-[#171614] px-4 py-3 text-left text-white/62 transition-[background-color,border-color,color] duration-300 hover:bg-[#211f1b] hover:text-white"
                        style={{ borderColor: active ? accent : "transparent" }}
                        aria-pressed={active}
                    >
                        <span className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" strokeWidth={2} />
                            <span className="font-minecraft text-xs font-bold">
                                {status.label}
                            </span>
                        </span>
                        <span className="text-xs font-bold text-white/38">
                            {itemCount}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
