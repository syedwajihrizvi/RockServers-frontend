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
    active: boolean,
    endTime: string | null,
    startTime: string,
    users: string[]
}

export interface IPost {
    id: number,
    title: string,
    description: string,
    postedAt: Date,
    gameId: number,
    gameName: string,
    appUser: {
        username: string
    },
    platformName: string,
    comments: IComment[],
    sessions: ISession[],
    activeSession: boolean,
    imagePath: string,
    views: number,
    likes: number,
    dislikes: number
}

export interface IDiscussion {
    id: number,
    postedAt: Date,
    title: string,
    gameId: number,
    gameName: string,
    content: string,
    imagePath: string,
    otherImages: string[],
    appUser: {
        username: string
    },
    comments: IComment[],
    views: number,
    likes: number
}

export interface IGame {
    id: number,
    title: string,
    slug: string
}

export interface IPlatform {
    id: number,
    name: string
}