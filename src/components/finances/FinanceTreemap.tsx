import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FinanceNode } from "../../features/finances/finance.service";

type FinanceTreemapProps = {
    nodes: FinanceNode[];
    total: number;
    currency: string;
    onSelect: (node: FinanceNode) => void;
};

type TreemapRectangle = {
    node: FinanceNode;
    x: number;
    y: number;
    width: number;
    height: number;
};

const palette = [
    "#c7a35a",
    "#d9b86e",
    "#d88a55",
    "#9fbd79",
    "#6fa9a2",
    "#8a86b8",
    "#b77777",
    "#7896b6",
];

function formatAmount(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat("en", {
            style: "currency",
            currency,
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount);
    } catch {
        return `${new Intl.NumberFormat("en", {
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(amount)} ${currency}`;
    }
}

function colorWithAlpha(color: string, alpha: number): string {
    const match = /^#([\da-f]{6})$/i.exec(color);

    if (!match) return `rgba(199, 163, 90, ${alpha})`;

    const value = Number.parseInt(match[1], 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function splitTreemap(
    nodes: FinanceNode[],
    x: number,
    y: number,
    width: number,
    height: number,
    rectangles: TreemapRectangle[],
): void {
    if (nodes.length === 0) return;

    if (nodes.length === 1) {
        rectangles.push({ node: nodes[0], x, y, width, height });
        return;
    }

    const total = nodes.reduce((sum, node) => sum + node.amount, 0);
    const target = total / 2;
    let running = 0;
    let splitIndex = 1;
    let smallestDifference = Number.POSITIVE_INFINITY;

    for (let index = 0; index < nodes.length - 1; index += 1) {
        running += nodes[index].amount;
        const difference = Math.abs(target - running);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            splitIndex = index + 1;
        }
    }

    const first = nodes.slice(0, splitIndex);
    const second = nodes.slice(splitIndex);
    const firstTotal = first.reduce((sum, node) => sum + node.amount, 0);
    const ratio = total > 0 ? firstTotal / total : 0.5;

    if (width >= height) {
        const firstWidth = width * ratio;
        splitTreemap(first, x, y, firstWidth, height, rectangles);
        splitTreemap(
            second,
            x + firstWidth,
            y,
            width - firstWidth,
            height,
            rectangles,
        );
        return;
    }

    const firstHeight = height * ratio;
    splitTreemap(first, x, y, width, firstHeight, rectangles);
    splitTreemap(
        second,
        x,
        y + firstHeight,
        width,
        height - firstHeight,
        rectangles,
    );
}

export function FinanceTreemap({
    nodes,
    total,
    currency,
    onSelect,
}: FinanceTreemapProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        const updateSize = () => {
            const bounds = container.getBoundingClientRect();
            setSize({ width: bounds.width, height: bounds.height });
        };
        const observer = new ResizeObserver(updateSize);

        updateSize();
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    const rectangles = useMemo(() => {
        const result: TreemapRectangle[] = [];
        const sortedNodes = [...nodes].sort((a, b) => b.amount - a.amount);

        splitTreemap(sortedNodes, 0, 0, size.width, size.height, result);

        return result;
    }, [nodes, size.height, size.width]);

    return (
        <div
            ref={containerRef}
            className="relative h-[420px] shrink-0 overflow-hidden rounded-xl bg-[#0d0c0b] sm:h-[520px] xl:h-auto xl:min-h-[440px] xl:flex-1"
        >
            {rectangles.map((rectangle, index) => {
                const { node, x, y, width, height } = rectangle;
                const color = node.color || palette[index % palette.length];
                const hasChildren = node.children.length > 0;
                const compact = width < 190 || height < 115;
                const tiny = width < 115 || height < 72;
                const showAmount = width >= 125 && height >= 120;
                const share = total > 0 ? (node.amount / total) * 100 : 0;

                return (
                    <button
                        key={node.id}
                        type="button"
                        disabled={!hasChildren}
                        onClick={() => onSelect(node)}
                        className={`group absolute overflow-hidden rounded-lg border text-left transition-[left,top,width,height,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white ${
                            hasChildren
                                ? "cursor-pointer hover:z-10 hover:brightness-125"
                                : "cursor-default"
                        }`}
                        style={{
                            left: x + 3,
                            top: y + 3,
                            width: Math.max(0, width - 6),
                            height: Math.max(0, height - 6),
                            backgroundColor: colorWithAlpha(color, 0.2),
                            borderColor: colorWithAlpha(color, 0.58),
                        }}
                        aria-label={`${node.name}, ${formatAmount(node.amount, currency)}, ${share.toFixed(1)}%${hasChildren ? ", open subgroup" : ""}`}
                    >
                        <span
                            className="absolute inset-x-0 top-0 h-1"
                            style={{ backgroundColor: color }}
                        />
                        <span
                            className={`flex h-full flex-col ${tiny ? "p-3" : "p-5"}`}
                        >
                            <span className="flex items-start justify-between gap-2">
                                <span
                                    className={`font-minecraft font-bold leading-tight text-white ${
                                        tiny
                                            ? "text-[10px]"
                                            : compact
                                              ? "text-xs"
                                              : "text-base"
                                    }`}
                                >
                                    {node.name}
                                </span>
                                {hasChildren && !tiny ? (
                                    <ChevronRight
                                        size={17}
                                        className="shrink-0 text-white/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                                    />
                                ) : null}
                            </span>
                            {showAmount ? (
                                <span className="mt-auto pt-4">
                                    <span
                                        className={`block font-minecraft font-bold text-white ${compact ? "text-xs" : "text-lg"}`}
                                    >
                                        {formatAmount(node.amount, currency)}
                                    </span>
                                    {!compact ? (
                                        <span className="mt-1 block text-[11px] font-semibold text-white/45">
                                            {share.toFixed(1)}% of this level
                                        </span>
                                    ) : null}
                                </span>
                            ) : null}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
