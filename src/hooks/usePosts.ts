import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IPost } from "../utils/interfaces/Interfaces"

export const usePosts = () => {
    const fetchPosts = () =>
        apiClient.get<IPost[]>('/posts').then(res => res.data)
    return useQuery<IPost[], Error>({
        queryKey: ["posts"],
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