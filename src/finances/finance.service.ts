import { cockpit } from "../../lib/api/cockpit";

export type FinanceKind = "income" | "expense";

export type FinancePeriod = {
    id: string;
    title: string;
    summary: string | null;
    currency: string;
    startDate: string | null;
    endDate: string | null;
    featured: boolean;
    order: number;
};

export type FinanceEntry = {
    id: string;
    periodId: string;
    parentId: string | null;
    kind: FinanceKind;
    name: string;
    description: string | null;
    amount: number;
    color: string | null;
    order: number;
};

export type FinanceNode = FinanceEntry & {
    children: FinanceNode[];
};

export type FinanceData = {
    periods: FinancePeriod[];
    entries: FinanceEntry[];
};

type CockpitRelation =
    | string
    | { _id?: string; data?: CockpitRelation | CockpitRelation[] }
    | CockpitRelation[]
    | null;

type CockpitSelectOption = string | { label?: string; value?: string };

type CockpitFinancePeriod = {
    _id?: string;
    title?: string;
    summary?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
    featured?: boolean | number | string;
    order?: number | string;
    active?: boolean | number | string;
};

type CockpitFinanceEntry = {
    _id?: string;
    period?: CockpitRelation;
    parent?: CockpitRelation;
    kind?: CockpitSelectOption | CockpitSelectOption[] | null;
    name?: string;
    description?: string;
    amount?: number | string;
    color?: string;
    order?: number | string;
    active?: boolean | number | string;
};

function isEnabled(value: boolean | number | string | undefined): boolean {
    if (value === undefined) return true;
    if (value === false || value === 0) return false;

    return !["0", "false"].includes(String(value).trim().toLowerCase());
}

function isTrue(value: boolean | number | string | undefined): boolean {
    if (value === true || value === 1) return true;

    return ["1", "true"].includes(
        String(value ?? "")
            .trim()
            .toLowerCase(),
    );
}

function numericValue(value: number | string | undefined): number {
    const number = Number(value);

    return Number.isFinite(number) ? number : 0;
}

function relationId(value: CockpitRelation | undefined): string | null {
    if (!value) return null;
    if (typeof value === "string") return value.trim() || null;

    if (Array.isArray(value)) {
        for (const item of value) {
            const id = relationId(item);

            if (id) return id;
        }

        return null;
    }

    const id = value._id?.trim();

    return id || relationId(value.data);
}

function selectValue(
    value: CockpitSelectOption | CockpitSelectOption[] | null | undefined,
): string {
    if (typeof value === "string") return value.trim().toLowerCase();
    if (Array.isArray(value)) return selectValue(value[0]);

    return (value?.value ?? value?.label ?? "").trim().toLowerCase();
}

function mapPeriod(item: CockpitFinancePeriod): FinancePeriod | null {
    const id = item._id?.trim();
    const title = item.title?.trim();

    if (!id || !title) return null;

    return {
        id,
        title,
        summary: item.summary?.trim() || null,
        currency: item.currency?.trim().toUpperCase() || "EUR",
        startDate: item.start_date?.trim() || null,
        endDate: item.end_date?.trim() || null,
        featured: isTrue(item.featured),
        order: numericValue(item.order),
    };
}

function mapEntry(item: CockpitFinanceEntry): FinanceEntry | null {
    const id = item._id?.trim();
    const periodId = relationId(item.period);
    const name = item.name?.trim();
    const kind = selectValue(item.kind);

    if (!id || !periodId || !name || (kind !== "income" && kind !== "expense"))
        return null;

    return {
        id,
        periodId,
        parentId: relationId(item.parent),
        kind,
        name,
        description: item.description?.trim() || null,
        amount: Math.max(0, numericValue(item.amount)),
        color: item.color?.trim() || null,
        order: numericValue(item.order),
    };
}

function compareNodes(a: FinanceNode, b: FinanceNode): number {
    return (
        a.order - b.order || b.amount - a.amount || a.name.localeCompare(b.name)
    );
}

function createsCycle(
    entry: FinanceEntry,
    entries: Map<string, FinanceEntry>,
): boolean {
    const visited = new Set([entry.id]);
    let parentId = entry.parentId;

    while (parentId) {
        if (visited.has(parentId)) return true;
        visited.add(parentId);
        parentId = entries.get(parentId)?.parentId ?? null;
    }

    return false;
}

function calculateNode(node: FinanceNode): FinanceNode {
    const children = node.children
        .map(calculateNode)
        .filter((child) => child.amount > 0)
        .sort(compareNodes);

    return {
        ...node,
        amount:
            children.length > 0
                ? children.reduce((sum, child) => sum + child.amount, 0)
                : node.amount,
        children,
    };
}

export function buildFinanceTree(
    entries: FinanceEntry[],
    periodId: string,
    kind: FinanceKind,
): FinanceNode[] {
    const matchingEntries = entries.filter(
        (entry) => entry.periodId === periodId && entry.kind === kind,
    );
    const entriesById = new Map(
        matchingEntries.map((entry) => [entry.id, entry]),
    );
    const nodesById = new Map(
        matchingEntries.map((entry) => [
            entry.id,
            { ...entry, children: [] } as FinanceNode,
        ]),
    );
    const roots: FinanceNode[] = [];

    for (const entry of matchingEntries) {
        const node = nodesById.get(entry.id);
        const parent = entry.parentId ? nodesById.get(entry.parentId) : null;

        if (!node) continue;

        if (parent && !createsCycle(entry, entriesById)) {
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots
        .map(calculateNode)
        .filter((node) => node.amount > 0)
        .sort(compareNodes);
}

export async function getFinanceData(): Promise<FinanceData> {
    const [periodItems, entryItems] = await Promise.all([
        cockpit.items<CockpitFinancePeriod>("financeperiods", {
            sort: { order: 1 },
        }),
        cockpit.items<CockpitFinanceEntry>("financeentries", {
            sort: { order: 1 },
            populate: 1,
        }),
    ]);

    return {
        periods: periodItems
            .filter((item) => isEnabled(item.active))
            .map(mapPeriod)
            .filter((item): item is FinancePeriod => item !== null)
            .sort(
                (a, b) =>
                    Number(b.featured) - Number(a.featured) ||
                    a.order - b.order ||
                    b.title.localeCompare(a.title),
            ),
        entries: entryItems
            .filter((item) => isEnabled(item.active))
            .map(mapEntry)
            .filter((item): item is FinanceEntry => item !== null),
    };
}
