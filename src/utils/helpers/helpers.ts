import { formatDistanceToNow } from 'date-fns'
import { IPost, IUser } from "../interfaces/Interfaces"
import { z, ZodError } from 'zod'

export const generateReadyImageUrl = (image: string) =>
    `http://localhost:5191/ready_images/${image}.webp`

export const generateImageUrl = (image: string) => 
    `http://localhost:5191/uploads/images/${image}.webp`

export const generateProfileImageUrl = (user: IUser) =>
    user.avatar ? 
        `http://localhost:5191/uploads/avatar_images/${user.avatar}.webp` : 
        `http://localhost:5191/uploads/profile_images/${user.profileImage}.webp`

export const generateVideoUrl = (video: string) =>
    `http://localhost:5191/uploads/videos/${video}`

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

export const fileIsVideo = (file: File) => 
    file && file.type.includes("video")

export const stringArraysEqual = (arr1: string[] | undefined, arr2: string[] | undefined) : boolean => {
    if ((!arr1 && arr2) || (!arr2 && arr1))
        return false
    if (arr1?.length != arr2?.length)
        return false
    for (let index = 0; index < arr1!.length; index++) {
        if (arr1![index] != arr2![index])
            return false
    }
    return true
}

// Register field validations
// eslint-disable-next-line no-useless-escape
const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*()_+=\-`~[\]{}|;':",.\/<>?]).{8,}$/;

const User = z.object({
    email: z.string().email("Please provide a valid email address."),
    firstname: z.string().min(2, "Please enter a first name with at least 2 characters").max(255, "Please enter a first name with less than 255 characters"),
    lastname: z.string().min(2, "Please enter a last name with at least 2 characters").max(255, "Please enter a last name with less than 255 characters"),
    username: z.string().min(3, "Please enter a username with at least 3 characters").max(255, "Please enter a username with less than 255 characters"),
    password: z.string().regex(passwordRegex, "Password must be at least 8 characters, 1 uppercase, 1 lowercase, 1 special character, and 1 number."),
})

type User = z.infer<typeof User>

export const validateUserRegister = (user: User) => {
    try {
        User.parse(user)
        return {}
    } catch (error) {
        if (error instanceof ZodError) {
            const errors: Record<string, string> = {};
            error.issues.forEach(issue => {
              const field = issue.path.join(".");
              errors[field] = issue.message;
            });
            return errors
        }
    }
}