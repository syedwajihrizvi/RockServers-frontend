import {IPost} from "../interfaces/Interfaces"

export const hasActiveSession = (post: IPost) => {
    const activeSession = post.sessions
                              .filter((session) => session.active)
    return activeSession
}

export const generateImageUrl = (image: string) => 
    `http://localhost:5191/uploads/post_images/${image}.webp`
