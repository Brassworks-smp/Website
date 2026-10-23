import {
    ArrowDownRight,
    ArrowUpRight,
    ChevronRight,
    CircleDollarSign,
    WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
    FinanceKind,
    FinanceNode,
} from "../../features/finances/finance.service";
import { buildFinanceTree } from "../../features/finances/finance.service";
import { useFinances } from "../../features/finances/use-finances";
import { useMobileLayout } from "../../lib/use-mobile-layout";
import { ButtonWipe } from "../general/ButtonWipe";
import { Footer } from "../general/Footer";
import { Header } from "../general/Header";
import { FinanceTreemap } from "./FinanceTreemap.tsx";

const SUPPORT_URL = "https://ko-fi.com/brassworks";

function sumNodes(nodes: FinanceNode[]): number {
    return nodes.reduce((sum, node) => sum + node.amount, 0);
}

function findNodePath(
    nodes: FinanceNode[],
    id: string,
    path: FinanceNode[] = [],
): FinanceNode[] {
    for (const node of nodes) {
        const nextPath = [...path, node];

        if (node.id === id) return nextPath;

        const childPath = findNodePath(node.children, id, nextPath);

        if (childPath.length > 0) return childPath;
    }

    return [];
}

function formatAmount(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat("en", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${new Intl.NumberFormat("en", {
            maximumFractionDigits: 2,
        }).format(amount)} ${currency}`;
    }
}

function formatPeriodDate(value: string | null): string | null {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

function periodRange(
    startDate: string | null,
    endDate: string | null,
): string | null {
    const start = formatPeriodDate(startDate);
    const end = formatPeriodDate(endDate);

    if (start && end) return `${start} to ${end}`;

    return start || end;
}

function previousMonth() {
    const now = new Date();
    const currentMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    const start = new Date(
        Date.UTC(
            currentMonth.getUTCFullYear(),
            currentMonth.getUTCMonth() - 1,
            1,
        ),
    );
    const end = new Date(currentMonth.getTime() - 1);

    return {
        start,
        end,
        label: new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
        }).format(start),
    };
}

function isPeriodForMonth(
    startDate: string | null,
    endDate: string | null,
    monthStart: Date,
    monthEnd: Date,
): boolean {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
        return false;

    return (
        start.getUTCFullYear() === monthStart.getUTCFullYear() &&
        start.getUTCMonth() === monthStart.getUTCMonth() &&
        start.getUTCDate() === 1 &&
        end.getUTCFullYear() === monthStart.getUTCFullYear() &&
        end.getUTCMonth() === monthStart.getUTCMonth() &&
        end.getUTCDate() === monthEnd.getUTCDate()
    );
}

function MetricCard({
    label,
    value,
    icon: Icon,
    accent = false,
}: {
    label: string;
    value: string;
    icon: typeof CircleDollarSign;
    accent?: boolean;
}) {
    return (
        <article className="rounded-xl bg-[#211f1b] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">
                    {label}
                </span>
                <Icon
                    size={18}
                    className={accent ? "text-[#d9b86e]" : "text-white/35"}
                />
            </div>
            <strong
                className={`mt-5 block font-minecraft text-lg font-bold sm:text-xl ${accent ? "text-[#d9b86e]" : "text-white"}`}
            >
                {value}
            </strong>
        </article>
    );
}

function EmptyFinances({
    error = false,
    monthLabel,
}: {
    error?: boolean;
    monthLabel?: string;
}) {
    return (
        <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-xl border border-white/8 bg-[#0d0c0b] px-6 text-center">
            <div className="max-w-md">
                <WalletCards
                    className="mx-auto h-8 w-8 text-[#d9b86e]"
                    strokeWidth={1.5}
                />
                <h2 className="mt-5 font-minecraft text-lg font-bold text-white">
                    {error
                        ? "Financial data is unavailable"
                        : "No financial data published"}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/45">
                    {error
                        ? "The financial overview could not be loaded."
                        : `Create an active reporting period for ${monthLabel ?? "the previous month"} and add active income or expense entries in Cockpit.`}
                </p>
            </div>
        </div>
    );
}

export function FinancePage() {
    const { data, isError, isLoading } = useFinances();
    const mobile = useMobileLayout();
    const [kind, setKind] = useState<FinanceKind>("expense");
    const [focusId, setFocusId] = useState<string | null>(null);
    const periods = data?.periods ?? [];
    const targetMonth = useMemo(previousMonth, []);
    const activePeriod = periods.find((period) =>
        isPeriodForMonth(
            period.startDate,
            period.endDate,
            targetMonth.start,
            targetMonth.end,
        ),
    );
    const incomeTree = useMemo(
        () =>
            activePeriod
                ? buildFinanceTree(
                      data?.entries ?? [],
                      activePeriod.id,
                      "income",
                  )
                : [],
        [activePeriod, data?.entries],
    );
    const expenseTree = useMemo(
        () =>
            activePeriod
                ? buildFinanceTree(
                      data?.entries ?? [],
                      activePeriod.id,
                      "expense",
                  )
                : [],
        [activePeriod, data?.entries],
    );
    const roots = kind === "income" ? incomeTree : expenseTree;
    const focusPath = useMemo(
        () => (focusId ? findNodePath(roots, focusId) : []),
        [focusId, roots],
    );
    const focusedNode = focusPath.at(-1) ?? null;
    const visibleNodes = focusedNode?.children ?? roots;
    const visibleTotal = sumNodes(visibleNodes);
    const incomeTotal = sumNodes(incomeTree);
    const expenseTotal = sumNodes(expenseTree);
    const balance = incomeTotal - expenseTotal;
    const currency = activePeriod?.currency ?? "EUR";
    const range = activePeriod
        ? periodRange(activePeriod.startDate, activePeriod.endDate)
        : null;

    useEffect(() => {
        setFocusId(null);
    }, [activePeriod?.id, kind]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape" || focusPath.length === 0) return;

            setFocusId(focusPath.at(-2)?.id ?? null);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [focusPath]);

    return (
        <>
            <Header />
            <main className="min-h-[100svh] bg-[#171614] px-4 pb-20 pt-[88px] text-white sm:px-8 sm:pb-24 sm:pt-[94px] lg:px-[60px]">
                <div className="mx-auto max-w-[1600px]">
                    <div className="flex flex-col xl:min-h-[calc(100svh-94px)]">
                        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                                    Open finances
                                </span>
                                <h1 className="mt-4 font-minecraft text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                                    Financial overview
                                </h1>
                                <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/55 sm:text-base">
                                    Explore where funds come from and how they
                                    are used. Select a section to open its
                                    underlying groups.
                                </p>
                            </div>

                            <div className="w-full rounded-xl bg-[#211f1b] px-5 py-4 lg:w-[300px]">
                                <div className="flex items-center justify-between gap-4">
                                    <span>
                                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">
                                            Reporting period
                                        </span>
                                        <strong className="block font-minecraft text-sm text-white">
                                            {targetMonth.label}
                                        </strong>
                                    </span>
                                    <span className="rounded-md bg-[#c7a35a]/12 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#d9b86e]">
                                        Previous month
                                    </span>
                                </div>
                            </div>
                        </header>

                        {activePeriod ? (
                            <section className="mt-10 rounded-xl bg-[#0d0c0b] px-5 py-5 sm:px-7 sm:py-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="font-minecraft text-lg font-bold sm:text-xl">
                                            {activePeriod.title}
                                        </h2>
                                        {activePeriod.summary || range ? (
                                            <p className="mt-2 text-xs font-semibold leading-5 text-white/45 sm:text-sm">
                                                {[activePeriod.summary, range]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="inline-flex w-full rounded-lg bg-[#211f1b] p-1 sm:w-auto">
                                        {(["expense", "income"] as const).map(
                                            (option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() =>
                                                        setKind(option)
                                                    }
                                                    className={`min-h-10 flex-1 cursor-pointer rounded-md px-5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors sm:flex-none ${
                                                        kind === option
                                                            ? "bg-[#c7a35a] text-[#171614]"
                                                            : "text-white/45 hover:bg-white/5 hover:text-white"
                                                    }`}
                                                >
                                                    {option === "expense"
                                                        ? "Expenses"
                                                        : "Income"}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        {activePeriod ? (
                            <section className="mt-3 grid gap-3 sm:grid-cols-3">
                                <MetricCard
                                    label="Total income"
                                    value={formatAmount(incomeTotal, currency)}
                                    icon={ArrowUpRight}
                                />
                                <MetricCard
                                    label="Total expenses"
                                    value={formatAmount(expenseTotal, currency)}
                                    icon={ArrowDownRight}
                                />
                                <MetricCard
                                    label="Balance"
                                    value={formatAmount(balance, currency)}
                                    icon={CircleDollarSign}
                                    accent
                                />
                            </section>
                        ) : null}

                        <section className="mt-3 flex min-h-0 flex-1 flex-col">
                            {isLoading ? (
                                <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-xl bg-[#0d0c0b]">
                                    <span
                                        className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#d9b86e]"
                                        aria-label="Loading financial data"
                                    />
                                </div>
                            ) : isError ? (
                                <EmptyFinances error />
                            ) : !activePeriod ? (
                                <EmptyFinances monthLabel={targetMonth.label} />
                            ) : (
                                <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.65fr)]">
                                    <div className="flex min-h-0 min-w-0 flex-col rounded-xl bg-[#211f1b] p-3 sm:p-4">
                                        <div className="mb-3 flex min-h-11 flex-wrap items-center gap-1.5 px-1 max-lg:mb-0">
                                            <button
                                                type="button"
                                                onClick={() => setFocusId(null)}
                                                className={`cursor-pointer rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                                                    focusPath.length === 0
                                                        ? "bg-[#c7a35a] text-[#171614]"
                                                        : "text-white/48 hover:bg-white/5 hover:text-white"
                                                }`}
                                            >
                                                All{" "}
                                                {kind === "expense"
                                                    ? "expenses"
                                                    : "income"}
                                            </button>
                                            {focusPath.map((node, index) => (
                                                <span
                                                    key={node.id}
                                                    className="inline-flex items-center gap-1.5"
                                                >
                                                    <ChevronRight
                                                        size={14}
                                                        className="text-white/20"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFocusId(node.id)
                                                        }
                                                        className={`cursor-pointer rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                                                            index ===
                                                            focusPath.length - 1
                                                                ? "bg-[#c7a35a] text-[#171614]"
                                                                : "text-white/48 hover:bg-white/5 hover:text-white"
                                                        }`}
                                                    >
                                                        {node.name}
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {visibleNodes.length === 0 ? (
                                            <EmptyFinances
                                                monthLabel={targetMonth.label}
                                            />
                                        ) : mobile ? null : (
                                            <FinanceTreemap
                                                nodes={visibleNodes}
                                                total={visibleTotal}
                                                currency={currency}
                                                onSelect={(node) => {
                                                    if (
                                                        node.children.length > 0
                                                    )
                                                        setFocusId(node.id);
                                                }}
                                            />
                                        )}
                                    </div>

                                    <aside className="rounded-xl bg-[#211f1b] p-5 sm:p-6 xl:h-0 xl:min-h-full xl:overflow-y-auto">
                                        <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-5">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                                                    Breakdown
                                                </span>
                                                <h2 className="mt-2 font-minecraft text-base font-bold">
                                                    {focusedNode?.name ??
                                                        (kind === "expense"
                                                            ? "All expenses"
                                                            : "All income")}
                                                </h2>
                                            </div>
                                            <strong className="font-minecraft text-sm text-[#d9b86e]">
                                                {formatAmount(
                                                    visibleTotal,
                                                    currency,
                                                )}
                                            </strong>
                                        </div>

                                        <div className="mt-3 grid gap-1">
                                            {[...visibleNodes]
                                                .sort(
                                                    (a, b) =>
                                                        b.amount - a.amount,
                                                )
                                                .map((node) => {
                                                    const share =
                                                        visibleTotal > 0
                                                            ? (node.amount /
                                                                  visibleTotal) *
                                                              100
                                                            : 0;
                                                    const hasChildren =
                                                        node.children.length >
                                                        0;

                                                    return (
                                                        <button
                                                            key={node.id}
                                                            type="button"
                                                            disabled={
                                                                !hasChildren
                                                            }
                                                            onClick={() =>
                                                                setFocusId(
                                                                    node.id,
                                                                )
                                                            }
                                                            className={`group rounded-lg px-3 py-3 text-left transition-colors ${
                                                                hasChildren
                                                                    ? "cursor-pointer hover:bg-white/5"
                                                                    : "cursor-default"
                                                            }`}
                                                        >
                                                            <span className="flex items-start justify-between gap-3">
                                                                <span className="min-w-0">
                                                                    <span className="flex items-center gap-2">
                                                                        <span
                                                                            className="h-2 w-2 shrink-0 rounded-full bg-[#c7a35a]"
                                                                            style={
                                                                                node.color
                                                                                    ? {
                                                                                          backgroundColor:
                                                                                              node.color,
                                                                                      }
                                                                                    : undefined
                                                                            }
                                                                        />
                                                                        <span className="truncate text-xs font-bold text-white/78 group-hover:text-white">
                                                                            {
                                                                                node.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                    {node.description ? (
                                                                        <span className="mt-1.5 line-clamp-2 block pl-4 text-[11px] font-medium leading-4 text-white/35">
                                                                            {
                                                                                node.description
                                                                            }
                                                                        </span>
                                                                    ) : null}
                                                                </span>
                                                                <span className="flex shrink-0 items-center gap-1.5">
                                                                    <span className="text-[11px] font-bold text-white/48">
                                                                        {share.toFixed(
                                                                            1,
                                                                        )}
                                                                        %
                                                                    </span>
                                                                    {hasChildren ? (
                                                                        <ChevronRight
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-white/28 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                                                                        />
                                                                    ) : null}
                                                                </span>
                                                            </span>
                                                            <span className="mt-2.5 block h-1 overflow-hidden rounded-full bg-white/6">
                                                                <span
                                                                    className="block h-full rounded-full bg-[#c7a35a]"
                                                                    style={{
                                                                        width: `${Math.max(0, Math.min(100, share))}%`,
                                                                        backgroundColor:
                                                                            node.color ||
                                                                            undefined,
                                                                    }}
                                                                />
                                                            </span>
                                                            <span className="mt-2 block pl-4 text-[10px] font-semibold text-white/28">
                                                                {formatAmount(
                                                                    node.amount,
                                                                    currency,
                                                                )}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </aside>
                                </div>
                            )}
                        </section>
                    </div>

                    <section className="mt-3 flex flex-col gap-6 rounded-xl bg-[#211f1b] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div>
                            <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9b86e]">
                                Support Brassworks
                            </span>
                            <h2 className="mt-3 font-minecraft text-lg font-bold text-white sm:text-xl">
                                Help us keep everything running.
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/45">
                                Donations help cover our servers, gateways,
                                email, and protection services.
                            </p>
                        </div>
                        <a
                            href={SUPPORT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/button relative inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Donate</span>
                            <ArrowUpRight className="relative z-10 h-4 w-4" />
                        </a>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
