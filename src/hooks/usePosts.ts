import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { Post } from "../utils/interfaces/Interfaces"

export const usePosts = () => {
    const fetchPosts = () =>
        apiClient.get<Post[]>('/posts').then(res => res.data)
    return useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts
    })
}

export const usePost = (id: number) => {
    const fetchPost = () =>
        apiClient.get<Post>(`/posts/${id}`).then(res => res.data)
    return useQuery<Post, Error>({
        queryKey: ["posts", id],
        queryFn: fetchPost
    })
}