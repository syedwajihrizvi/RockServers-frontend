import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IDiscussion, InfiniteQueryData } from "../utils/interfaces/Interfaces"
import useQueryStore from "../stores/useQueryStore"

type DiscussionQueryParams = {
    gameId?: number,
    searchValue?: string,
    mostRecent?: boolean,
    orderBy?: string,
    userId?: string
}

export const useDiscussions = (queryParams: DiscussionQueryParams = {}) => {
    const { gameId, searchValue, orderBy } = useQueryStore()
    queryParams = {...queryParams, gameId, searchValue, orderBy}

    return useInfiniteQuery<InfiniteQueryData<IDiscussion>, Error>({
        queryKey: ['discussions', queryParams],
        queryFn: ({pageParam = 1}) => (
            apiClient.get<InfiniteQueryData<IDiscussion>>(
                `/discussions?page=${pageParam}`, 
                {params: queryParams} 
                )
                .then(res => res.data)
        ),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.hasMore)
                return allPages.length + 1;
            return undefined;
        },
        initialPageParam: 1
    })
}

export const useDiscussion = (discussionId: number) => {
    const fetchDiscussion = () =>
        apiClient.get<IDiscussion>(`/discussions/${discussionId}`).then(res => res.data)
    return useQuery<IDiscussion, Error>({
        queryKey: ['discussions', discussionId],
        queryFn: fetchDiscussion
    })
}