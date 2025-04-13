import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { ISession } from "../utils/interfaces/Interfaces"

export const useSessions = (postId: number, completed: boolean, active: boolean) => {
    const fetchSessionForPosts = () => 
        apiClient.get<ISession[]>('/sessions', {params: {postId, completed, active}}).then(res => res.data)

    return useQuery<ISession[], Error>({
        queryKey: ["sessions", postId],
        queryFn: fetchSessionForPosts
    })
}
