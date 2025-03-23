export interface Comment {
    id: number,
    title: string,
    content: string,
    commentedBy: string,
    commentedAt: Date,
    likes: number,
    dislikes: number
}

export interface Session {
    id: number,
    active: boolean
}

export interface Post {
    id: number,
    title: string,
    description: string,
    postedAt: Date,
    gameName: string,
    appUser: {
        username: string
    },
    comments: Comment[],
    sessions: Session[],
    views: number,
    likes: number,
    dislikes: number
}