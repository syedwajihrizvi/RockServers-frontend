import { INotification } from "../utils/interfaces/Interfaces"
import apiClient from "../utils/services/dataServices"
import { useQuery } from "@tanstack/react-query"

export const useNotifications = () => {
    const fetchNotifications = () =>
        apiClient.get<INotification[]>('/notifications', {headers: {
            Authorization: `Bearer ${localStorage.getItem('x-auth-token')}`
        }}).then(res => res.data)
    return useQuery<INotification[], Error>({
        queryKey: ["notifications"],
        queryFn: fetchNotifications
    })
}
