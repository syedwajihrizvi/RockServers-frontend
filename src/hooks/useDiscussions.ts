import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IDiscussion } from "../utils/interfaces/Interfaces"
import useQueryStore from "../stores/useQueryStore"

type DiscussionQueryParams = {
    gameId?: number,
    searchValue?: string,
    mostRecent?: boolean,
    orderBy?: string,
    userId?: string
}

export const useDiscussions = (queryParams: DiscussionQueryParams = {}) => {
    const { gameId, searchValue, mostRecent, orderBy } = useQueryStore()
    queryParams = {...queryParams, gameId, searchValue, mostRecent, orderBy}
    const fetchDiscussions = () =>
        apiClient.get<IDiscussion[]>('/discussions', {params: queryParams} )
                 .then(res => res.data)
    return useQuery<IDiscussion[], Error>({
        queryKey: ["discussions", queryParams],
        queryFn: fetchDiscussions
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