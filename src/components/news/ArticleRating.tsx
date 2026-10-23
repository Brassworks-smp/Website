import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ArticleRatingScore } from "../../features/news/article-rating.service.ts";
import {
    ArticleRatingApiError,
    getArticleRating,
    saveArticleRating,
} from "../../features/news/article-rating.service.ts";

const scores: ArticleRatingScore[] = [1, 2, 3, 4, 5];

type SaveState =
    "loading" | "idle" | "saving" | "saved" | "rate-limited" | "error";

export function ArticleRating({ articleId }: { articleId: string }) {
    const [score, setScore] = useState<ArticleRatingScore | null>(null);
    const [previewScore, setPreviewScore] = useState<ArticleRatingScore | null>(
        null,
    );
    const [saveState, setSaveState] = useState<SaveState>("loading");
    const saveSequence = useRef(0);
    const visibleScore = previewScore ?? score ?? 0;
    const locked =
        score !== null ||
        saveState === "loading" ||
        saveState === "saving" ||
        saveState === "rate-limited";

    useEffect(() => {
        let active = true;

        saveSequence.current += 1;
        setScore(null);
        setPreviewScore(null);
        setSaveState("loading");

        void getArticleRating(articleId)
            .then((rating) => {
                if (!active) return;

                setScore(rating.userRating);
                setSaveState(rating.userRating === null ? "idle" : "saved");
            })
            .catch(() => {
                if (active) setSaveState("error");
            });

        return () => {
            active = false;
        };
    }, [articleId]);

    const selectScore = async (nextScore: ArticleRatingScore) => {
        if (locked) return;

        const sequence = saveSequence.current + 1;
        saveSequence.current = sequence;
        setPreviewScore(null);
        setSaveState("saving");

        try {
            const rating = await saveArticleRating({
                articleId,
                score: nextScore,
            });

            if (saveSequence.current !== sequence) return;

            setScore(rating.userRating);
            setSaveState("saved");
        } catch (error) {
            if (saveSequence.current !== sequence) return;

            if (
                error instanceof ArticleRatingApiError &&
                error.status === 409
            ) {
                try {
                    const rating = await getArticleRating(articleId);

                    if (saveSequence.current !== sequence) return;

                    setScore(rating.userRating);
                    setSaveState(
                        rating.userRating === null ? "error" : "saved",
                    );
                } catch {
                    if (saveSequence.current === sequence)
                        setSaveState("error");
                }

                return;
            }

            setSaveState(
                error instanceof ArticleRatingApiError && error.status === 429
                    ? "rate-limited"
                    : "error",
            );
        }
    };

    return (
        <section
            aria-labelledby="article-rating-title"
            className="mt-16 border-t border-white/10 pt-10 text-center"
        >
            <h2
                id="article-rating-title"
                className="text-xl font-semibold tracking-[-0.015em] text-white sm:text-2xl"
            >
                Rate this article
            </h2>

            <div
                role="group"
                aria-label="Rate this article from 1 to 5 stars"
                onMouseLeave={() => {
                    if (!locked) setPreviewScore(null);
                }}
                className="mt-5 inline-flex items-center justify-center gap-1 sm:gap-2"
            >
                {scores.map((ratingScore) => {
                    const filled = ratingScore <= visibleScore;
                    const highlighted = ratingScore === visibleScore;

                    return (
                        <button
                            key={ratingScore}
                            type="button"
                            disabled={locked}
                            onClick={() => void selectScore(ratingScore)}
                            onMouseEnter={() => {
                                if (!locked) setPreviewScore(ratingScore);
                            }}
                            onFocus={() => {
                                if (!locked) setPreviewScore(ratingScore);
                            }}
                            onBlur={() => {
                                if (!locked) setPreviewScore(null);
                            }}
                            aria-label={`${ratingScore} out of 5 stars`}
                            aria-pressed={score === ratingScore}
                            className={`site-interactive flex h-11 w-11 items-center justify-center rounded-full transition-[color,transform] sm:h-12 sm:w-12 ${
                                locked
                                    ? "cursor-default"
                                    : "cursor-pointer active:scale-95"
                            } ${
                                filled
                                    ? "text-[#d9b86e]"
                                    : locked
                                      ? "text-white/18"
                                      : "text-white/18 hover:text-[#d9b86e]"
                            } ${highlighted ? "scale-110" : "scale-100"}`}
                        >
                            <Star
                                className="h-7 w-7 sm:h-8 sm:w-8"
                                fill={filled ? "currentColor" : "none"}
                                strokeWidth={1.8}
                            />
                        </button>
                    );
                })}
            </div>

            <span className="sr-only" aria-live="polite">
                {saveState === "saved"
                    ? `${score} out of 5 stars saved.`
                    : saveState === "saving"
                      ? "Saving rating."
                      : saveState === "rate-limited"
                        ? "Too many rating attempts. Please try again shortly."
                        : saveState === "error"
                          ? "The rating could not be loaded or saved."
                          : ""}
            </span>
        </section>
    );
}
