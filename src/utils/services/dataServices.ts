import axios, { AxiosResponse } from "axios"

const production = import.meta.env.PROD
console.log(`Production: ${production}`)
const baseUrl = "http://localhost:5191/api"
const prodUrl = import.meta.env.VITE_API_URL;
const url = production ? prodUrl : baseUrl

const client = axios.create({
    baseURL: url,
})

export const createPost = (formData: FormData): Promise<AxiosResponse> =>
    client.post(
        '/posts', formData, 
        { headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`, 
              "Content-Type": 'multipart/form-data'}
        })

export const createDiscussion = (formData: FormData): Promise<AxiosResponse> =>
    client.post(
        '/discussions', formData,
        {headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`, 
             "Content-Type": "multipart/form-data"}})  

export const deletePost = (postId: number): Promise<AxiosResponse> =>
    client.delete(
        `/posts/${postId}`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`}}
    )

export const updatePost = (postId: number, formData: FormData): Promise<AxiosResponse> =>
    client.patch(
        `/posts/${postId}`,
        formData,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`}}
    )

export const deleteDiscussion = (discussionId: number): Promise<AxiosResponse> =>
    client.delete(
        `/discussions/${discussionId}`,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`}}
    )

export const updateDiscussion = (discussionId: number, formData: FormData): Promise<AxiosResponse> =>
    client.patch(
        `/discussions/${discussionId}`,
        formData,
        {headers: {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`}}
    )
export const updateUserSettings = (formData: FormData, field: string): Promise<AxiosResponse> => {
    return client.patch(
        `/accounts/update/${field}`, 
        formData, 
        {headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`, 
            "Content-Type": "multipart/form-data"}})
}

export const registerUser = (formData: FormData): Promise<AxiosResponse> => {
    return client.post("/accounts/register", formData)
}

export default client