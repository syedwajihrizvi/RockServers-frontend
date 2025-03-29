import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IDiscussion } from "../utils/interfaces/Interfaces"
import useQueryStore from "../stores/useQueryStore"

type DiscussionQueryParams = {
    gameId?: number,
    discussionToRemoveId?: number
}

export const useDiscussions = (queryParams: DiscussionQueryParams = {}) => {
    const { gameId } = useQueryStore()
    queryParams = {...queryParams, gameId}
    const fetchDiscussions = () =>
        apiClient.get<IDiscussion[]>('/discussions', {params: queryParams} )
                 .then(res => res.data)
    return useQuery<IDiscussion[], Error>({
        queryKey: ["discussions", queryParams],
        queryFn: fetchDiscussions
    })
}