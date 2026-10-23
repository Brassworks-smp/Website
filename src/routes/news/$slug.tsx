import { Fragment } from "react";
import { ArrowLeft } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../../components/general/Footer";
import { Header } from "../../components/general/Header";
import { ArticleContent } from "../../components/news/ArticleContent";
import { NewsCoverBrand } from "../../components/news/NewsCoverBrand";
import { newsArticleQuery, useNewsArticle } from "../../features/news/use-news";
import { createPageMetadata } from "../../lib/seo";

export const Route = createFileRoute("/news/$slug")({
    loader: ({ context, params }) =>
        context.queryClient.ensureQueryData(newsArticleQuery(params.slug)),
    head: ({ loaderData: article }) => {
        if (!article) {
            return createPageMetadata({
                title: "Brassworks | Article Not Found",
                description:
                    "The requested Brassworks article could not be found.",
                path: "/news",
            });
        }

        const authorNames = article.authors
            .map((author) => author.name)
            .join(", ");
        const metadata = createPageMetadata({
            title: `Brassworks | ${article.title}`,
            description: article.description,
            path: `/news/${article.id}`,
            image: article.cover,
            imageAlt: article.coverAlt,
            type: "article",
        });

        return {
            meta: [
                ...metadata.meta,
                ...(authorNames
                    ? [{ name: "author", content: authorNames }]
                    : []),
                ...article.authors.map((author) => ({
                    property: "article:author",
                    content: author.name,
                })),
                {
                    property: "article:published_time",
                    content: article.publishedAt,
                },
            ],
            links: metadata.links,
        };
    },
    component: NewsArticleRoute,
});

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

function NewsArticleRoute() {
    const { slug: articleId } = Route.useParams();
    const { data: article, isPending, isError } = useNewsArticle(articleId);

    if (isPending) {
        return (
            <>
                <Header />
                <main className="min-h-screen animate-pulse bg-[#171614] px-4 pb-24 pt-[110px] sm:px-8 lg:px-[60px]">
                    <div className="mx-auto max-w-[1200px]">
                        <div className="h-7 w-28 rounded bg-[#211f1b]" />
                        <div className="mt-8 aspect-video rounded-xl bg-[#211f1b]" />
                        <div className="mx-auto mt-10 h-36 max-w-4xl rounded-xl bg-[#211f1b]" />
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (isError || !article) {
        return (
            <>
                <Header />
                <main className="grid min-h-[75vh] place-items-center bg-[#171614] px-4 pt-[60px] text-center text-white">
                    <div>
                        <span className="font-minecraft text-xs uppercase tracking-[0.16em] text-[#d9b86e]">
                            404
                        </span>
                        <h1 className="mt-4 font-minecraft text-3xl font-bold sm:text-4xl">
                            Article not found
                        </h1>
                        <a
                            href="/news"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#d9b86e]"
                        >
                            <ArrowLeft size={17} /> Back to News
                        </a>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#171614] pb-24 pt-[60px] text-white">
                <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-8 sm:pt-16 lg:px-[60px]">
                    <div className="flex items-center justify-between gap-6 border-b border-white/8 pb-5">
                        <a
                            href="/news"
                            className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-white/65 transition-colors hover:text-[#d9b86e]"
                        >
                            <ArrowLeft size={16} /> All News
                        </a>
                        <span className="font-minecraft text-lg font-bold text-white sm:text-xl">
                            News
                        </span>
                    </div>

                    <article>
                        <div className="mt-10 flex justify-center sm:mt-12">
                            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl rounded-br-none bg-[#0d0c0b]">
                                <img
                                    src={article.cover}
                                    alt={article.coverAlt}
                                    className="h-full w-full object-cover"
                                    decoding="async"
                                />
                                <NewsCoverBrand large surface="page" />
                            </div>
                        </div>

                        <header className="mx-auto max-w-4xl pt-10 sm:pt-12">
                            <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.15em] text-[#d9b86e]">
                                {article.tag}
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold leading-[1.12] tracking-[-0.025em] text-white sm:text-4xl lg:text-5xl">
                                {article.title}
                            </h1>
                            <p className="mt-5 max-w-3xl whitespace-pre-line text-base font-normal leading-8 text-white/65 sm:text-lg">
                                {article.description}
                            </p>
                            <div className="mt-6 flex flex-wrap items-center text-sm font-semibold text-white/72">
                                {article.authors.map((author, index) => (
                                    <Fragment key={author.id}>
                                        {index > 0 ? (
                                            <span className="mx-1 text-white/45">
                                                {index ===
                                                article.authors.length - 1
                                                    ? article.authors.length > 2
                                                        ? ", and"
                                                        : "and"
                                                    : ","}
                                            </span>
                                        ) : null}
                                        <span className="inline-flex items-center gap-1.5 text-white/82">
                                            {author.avatar ? (
                                                <img
                                                    src={author.avatar}
                                                    alt=""
                                                    className="h-6 w-6 rounded-md object-cover [image-rendering:pixelated]"
                                                    decoding="async"
                                                />
                                            ) : null}
                                            <span>{author.name}</span>
                                        </span>
                                    </Fragment>
                                ))}
                                {article.authors.length > 0 ? (
                                    <span className="mx-2 text-white/35">
                                        •
                                    </span>
                                ) : null}
                                <time
                                    dateTime={article.publishedAt}
                                    className="text-white/58"
                                >
                                    {formatDate(article.publishedAt)}
                                </time>
                            </div>
                        </header>

                        <ArticleContent
                            articleId={article.id}
                            content={article.content}
                            title={article.title}
                            url={`https://brassworks.opnsoc.org/news/${article.id}`}
                        />
                    </article>
                </div>
            </main>
            <Footer />
        </>
    );
}
