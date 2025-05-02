import { IUser } from "../utils/interfaces/Interfaces"
import apiClient from "../utils/services/dataServices"
import { useQuery } from "@tanstack/react-query"

export const useUser = () => {
    const fetchUser = () => {
        const jwtToken = localStorage.getItem('x-auth-token')
        return apiClient.get<IUser>('/accounts/me', {headers: {
            Authorization: `Bearer ${jwtToken}`
        }})
        .then(res => res.data)
        .catch(error => {
            if (error.response?.status === 401) {
              return null; // User not logged in, no error thrown
            }
            throw error; // Other errors still thrown
          })
    }
    return useQuery<IUser | null, Error>({
        queryKey: ['me'],
        queryFn: fetchUser
    })
}

export const useProfile = (username: string) => {
    const fetchUser = () =>
        apiClient.get<IUser>(`/accounts/profile/${username}`)
        .then(res => res.data)
    return useQuery<IUser, Error>({
        queryKey: ['profile', username],
        queryFn: fetchUser,
        retry: false
    })
}
