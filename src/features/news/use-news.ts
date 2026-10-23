import { queryOptions, useQuery } from "@tanstack/react-query";
import { getAllNews, getLatestNews, getNewsArticle } from "./news.service";

export const latestNewsQuery = queryOptions({
    queryKey: ["cockpit", "news", "latest", 4],
    queryFn: () => getLatestNews(4),
    staleTime: 5 * 60 * 1000,
});

export const allNewsQuery = queryOptions({
    queryKey: ["cockpit", "news", "all"],
    queryFn: getAllNews,
    staleTime: 5 * 60 * 1000,
});

export function newsArticleQuery(id: string) {
    return queryOptions({
        queryKey: ["cockpit", "news", "article", id],
        queryFn: () => getNewsArticle(id),
        staleTime: 5 * 60 * 1000,
    });
}

export function useLatestNews() {
    return useQuery(latestNewsQuery);
}

export function useAllNews() {
    return useQuery(allNewsQuery);
}

export function useNewsArticle(id: string) {
    return useQuery(newsArticleQuery(id));
}
