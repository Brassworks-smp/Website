import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "../../components/general/Footer";
import { Header } from "../../components/general/Header";
import { NewsCard } from "../../components/general/NewsSection";
import { useAllNews } from "../../features/news/use-news";
import { createPageMetadata } from "../../lib/seo";

export const Route = createFileRoute("/news/")({
    head: () =>
        createPageMetadata({
            title: "Brassworks | News",
            description:
                "Read the latest Brassworks releases, project updates, community stories, and development news.",
            path: "/news",
        }),
    component: NewsIndexRoute,
});

function NewsIndexRoute() {
    const { data: articles = [], isPending, isError } = useAllNews();

    if (isPending || isError || articles.length === 0) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-[#171614] pt-[60px]" />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#171614] px-4 pb-20 pt-[118px] text-white sm:px-8 lg:px-[60px]">
                <div className="mx-auto max-w-[1600px]">
                    <header className="mb-10 max-w-3xl sm:mb-12">
                        <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                            From the Workshop
                        </span>
                        <h1 className="mt-4 font-minecraft text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            News
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/65 sm:text-base">
                            Releases, project updates, community stories, and a
                            closer look at what Brassworks is building.
                        </p>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {articles.map((article) => (
                            <NewsCard key={article.id} item={article} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
