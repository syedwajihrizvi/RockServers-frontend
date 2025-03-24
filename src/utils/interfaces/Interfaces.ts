export interface IComment {
    id: number,
    title: string,
    content: string,
    commentedBy: string,
    commentedAt: Date,
    likes: number,
    dislikes: number
}

export interface ISession {
    id: number,
    active: boolean
}

export interface IPost {
    id: number,
    title: string,
    description: string,
    postedAt: Date,
    gameName: string,
    appUser: {
        username: string
    },
    comments: IComment[],
    sessions: ISession[],
    views: number,
    likes: number,
    dislikes: number
}