import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { InfiniteQueryData, IPost } from "../utils/interfaces/Interfaces"
import useQueryStore from "../stores/useQueryStore"

type PostQueryParams = {
    gameId? :number,
    postToRemoveId?: number,
    platformId?: number,
    searchValue?: string,
    sessionType?: string,
    mostRecent?: boolean,
    orderBy?: string,
    userId?: string
}

export const usePosts = (queryParams: PostQueryParams = {}) => {
    const { gameId, platformId, searchValue, sessionType, orderBy } = useQueryStore()
    queryParams = {...queryParams, gameId, platformId, searchValue, sessionType, orderBy}

    return useInfiniteQuery<InfiniteQueryData<IPost>, Error>({
        queryKey: ["posts", queryParams],
        queryFn: ({ pageParam = 1 }) => (
            apiClient.get<InfiniteQueryData<IPost>>(
                `/posts?page=${pageParam}`, 
                {params: queryParams})
                .then(res => res.data)
        ),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.hasMore)
                return allPages.length + 1
            return undefined
        },
        initialPageParam: 1
    })
}

export const usePost = (id: number) => {
    const fetchPost = () =>
        apiClient.get<IPost>(`/posts/${id}`).then(res => res.data)
    return useQuery<IPost, Error>({
        queryKey: ["posts", id],
        queryFn: fetchPost
    })
}