import axios, { AxiosResponse } from "axios"

const url = "http://localhost:5191/api"

const client = axios.create({
    baseURL: url,
})

type postData = {
    title: string,
    description: string,
    gameId: number,
    platformId: number,
    imagePath: string
}

export const createPostWithUploadedImage = (formData: FormData): Promise<AxiosResponse> =>
    client.post(
        '/posts/customImage', 
        formData, 
        { headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`,
             "Content-Type": "multipart/form-data"}
        }) 

export const createPostWithSelectedImage = (data: postData): Promise<AxiosResponse> =>
    client.post(
        '/posts', 
        data, 
        { headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`, 
              "Content-Type": 'application/json'}
        })

export const createDiscussion = (formData: FormData, customImage: boolean): Promise<AxiosResponse> => {
    const endpoint = customImage ? '/discussions/customImage' : '/discussions'
    return client.post(
        endpoint, formData,
        {headers: 
            {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`, 
             "Content-Type": "multipart/form-data"}})  
}
export default client