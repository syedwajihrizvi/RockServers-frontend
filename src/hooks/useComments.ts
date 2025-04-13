import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IComment } from "../utils/interfaces/Interfaces"

export const useComment = (contentId:number) => {
    const fetchComments = () =>
        apiClient.get<IComment[]>("/comments", {params: {contentId}})
                 .then(res => res.data)
    return useQuery<IComment[], Error>({
        queryKey: ['comments', contentId],
        queryFn: fetchComments
    })
}

export const useDiscussionComment = (contentId:number) => {
    const fetchComments = () =>
        apiClient.get<IComment[]>("/discussionComments", {params: {contentId}})
                 .then(res => res.data)
    return useQuery<IComment[], Error>({
        queryKey: ['discussionComments', contentId],
        queryFn: fetchComments
    })
}