import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IPost } from "../utils/interfaces/Interfaces"
import useQueryStore from "../stores/useQueryStore"

type PostQueryParams = {
    gameId? :number,
    postToRemoveId?: number,
    platformId?: number,
    searchValue?: string
}

export const usePosts = (queryParams: PostQueryParams = {}) => {
    const { gameId, platformId, searchValue } = useQueryStore()
    queryParams = {...queryParams, gameId, platformId, searchValue}
    const fetchPosts = () =>
        apiClient.get<IPost[]>('/posts', {params: queryParams}).then(res => res.data)
    return useQuery<IPost[], Error>({
        queryKey: ["posts", queryParams],
        queryFn: fetchPosts
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