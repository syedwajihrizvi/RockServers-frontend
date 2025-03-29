import {IPost} from "../interfaces/Interfaces"

export const hasActiveSession = (post: IPost) => {
    const activeSession = post.sessions
                              .filter((session) => session.active)
    return activeSession
}

export const generateImageUrl = (image: string) => 
    `http://localhost:5191/uploads/post_images/${image}.webp`

export const capitalize = (word: string) =>
    `${word[0].toUpperCase()}${word.slice(1)}`

export const renderPartialContent = (content: string) => {
    if (content.length < 100)
        return content
    return `${content.slice(0, 100)}...`
}