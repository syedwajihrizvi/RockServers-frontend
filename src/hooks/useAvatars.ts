import { IAvatar } from "../utils/interfaces/Interfaces"
import apiClient from "../utils/services/dataServices"

import { useQuery } from "@tanstack/react-query"

export const useAvatars = () => {
    const fetchAvatars = () =>
        apiClient.get<IAvatar[]>("/images/avatars").then(res => res.data)
    return useQuery<IAvatar[], Error>({
        queryKey: ["avatars"],
        queryFn: fetchAvatars
    })
}