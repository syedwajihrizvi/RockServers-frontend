export interface Comment {
    id: number
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