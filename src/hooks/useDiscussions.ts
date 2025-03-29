import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IDiscussion } from "../utils/interfaces/Interfaces"

export const useDiscussions = () => {
    const fetchDiscussions = () =>
        apiClient.get<IDiscussion[]>('/discussions').then(res => res.data)
    return useQuery<IDiscussion[], Error>({
        queryKey: ["discussions"],
        queryFn: fetchDiscussions
    })
}