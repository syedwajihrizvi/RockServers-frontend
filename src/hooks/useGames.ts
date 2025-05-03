import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/services/dataServices"
import { IGame } from "../utils/interfaces/Interfaces"

export const useGames = () => {
    const fetchGames = () =>
        apiClient.get<IGame[]>('/games', {params: {sortby: "title"}}).then(res => res.data)
    return useQuery<IGame[], Error>({
        queryKey: ["games"],
        queryFn: fetchGames
    })
}