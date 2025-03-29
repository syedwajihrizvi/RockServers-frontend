import { useQuery } from "@tanstack/react-query"
import apiClient from "../utils/services/dataServices"
import { IPlatform } from "../utils/interfaces/Interfaces"

export const usePlatforms = () => {
    const fetchPlatforms = () =>
        apiClient.get<IPlatform[]>('/platforms').then(res => res.data)
    return useQuery<IPlatform[], Error>({
        queryKey: ["platforms"],
        queryFn: fetchPlatforms
    })
}