import { formatDistanceToNow } from 'date-fns'
import { IPost, IUser } from "../interfaces/Interfaces"

export const generateReadyImageUrl = (image: string) =>
    `http://localhost:5191/ready_images/${image}.webp`

export const generateImageUrl = (image: string) => 
    `http://localhost:5191/uploads/post_images/${image}.webp`

export const generateProfileImageUrl = (user: IUser) =>
    user.avatar ? 
        `http://localhost:5191/uploads/avatar_images/${user.avatar}.webp` : 
        `http://localhost:5191/uploads/profile_images/${user.profileImage}.webp`

export const generateVideoUrl = (video: string) =>
    `http://localhost:5191/uploads/discussion_videos/${video}`

export const generateAvatarImageUrl = (image: string) =>
    `http://localhost:5191/uploads/avatar_images/${image}.webp`

export const capitalize = (word: string) =>
    `${word[0].toUpperCase()}${word.slice(1)}`

export const renderPartialContent = (content: string) => {
    if (content.length < 100)
        return content
    return `${content.slice(0, 100)}...`
}

export const getSuccessfulSessions = (post: IPost) => {
    return post.sessions.filter(s => s.endTime)
}

export const formatStringDate = (toFormat: string) => {
   const timeAgo = formatDistanceToNow(new Date(toFormat), { addSuffix: true})
   return timeAgo
}

export const getDateDifference = (start: string, end: string) => {
    const time = new Date(end).getTime() - new Date(start).getTime()
    const totalSeconds =  Math.floor(time/1000)
    return formatSecondsToString(totalSeconds)

}

export const formatSecondsToString = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
  
    const h = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''
    const m = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''
  
    return [h, m].filter(Boolean).join(' and ') || '0 minutes'
}

export const userDidLike = (likes: number[] | undefined, target: number) => {
    return likes ? likes.includes(target) : false
}