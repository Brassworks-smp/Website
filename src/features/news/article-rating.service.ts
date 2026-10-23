export type ArticleRatingScore = 1 | 2 | 3 | 4 | 5;

export type ArticleRating = {
    articleId: string;
    average: number;
    count: number;
    distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
    userRating: ArticleRatingScore | null;
};

export type SaveArticleRatingInput = {
    articleId: string;
    score: ArticleRatingScore;
};

const configuredApiUrl = import.meta.env.VITE_BRASSWORKS_API_URL as
    string | undefined;
const apiBaseUrl = (configuredApiUrl?.trim() || "/api").replace(/\/+$/, "");

export class ArticleRatingApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ArticleRatingApiError";
        this.status = status;
    }
}

function isScore(value: unknown): value is ArticleRatingScore {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 5
    );
}

function isArticleRating(value: unknown): value is ArticleRating {
    if (!value || typeof value !== "object") return false;

    const rating = value as Partial<ArticleRating>;
    const distribution = rating.distribution;

    return (
        typeof rating.articleId === "string" &&
        typeof rating.average === "number" &&
        Number.isFinite(rating.average) &&
        typeof rating.count === "number" &&
        Number.isInteger(rating.count) &&
        rating.count >= 0 &&
        !!distribution &&
        typeof distribution === "object" &&
        ["1", "2", "3", "4", "5"].every((score) => {
            const amount = distribution[score as keyof typeof distribution];
            return Number.isInteger(amount) && amount >= 0;
        }) &&
        (rating.userRating === null || isScore(rating.userRating))
    );
}

async function responseError(
    response: Response,
): Promise<ArticleRatingApiError> {
    let message = `Rating API returned ${response.status}`;

    try {
        const body: unknown = await response.json();

        if (body && typeof body === "object" && "detail" in body) {
            const detail = (body as { detail?: unknown }).detail;

            if (typeof detail === "string") message = detail;
        }
    } catch {}

    return new ArticleRatingApiError(response.status, message);
}

async function parseRatingResponse(response: Response): Promise<ArticleRating> {
    if (!response.ok) throw await responseError(response);

    const rating: unknown = await response.json();

    if (!isArticleRating(rating)) {
        throw new ArticleRatingApiError(
            response.status,
            "Rating API returned an invalid response",
        );
    }

    return rating;
}

function ratingUrl(articleId: string) {
    return `${apiBaseUrl}/ratings/${encodeURIComponent(articleId)}`;
}

export async function getArticleRating(
    articleId: string,
): Promise<ArticleRating> {
    const response = await fetch(ratingUrl(articleId), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });

    return parseRatingResponse(response);
}

export async function saveArticleRating({
    articleId,
    score,
}: SaveArticleRatingInput): Promise<ArticleRating> {
    const response = await fetch(ratingUrl(articleId), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ score }),
    });

    return parseRatingResponse(response);
}
