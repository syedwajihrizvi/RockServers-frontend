import { IUser } from "../utils/interfaces/Interfaces"
import apiClient from "../utils/services/dataServices"
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
    const jwtToken = localStorage.getItem('x-auth-token')
    const fetchUser = () => 
        apiClient.get<IUser>('/accounts/me', {headers: {
            Authorization: `Bearer ${jwtToken}`
        }}).then(res => res.data)
    return useQuery<IUser, Error>({
        queryKey: ['me'],
        queryFn: fetchUser
    })
}