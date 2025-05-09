export interface IReply {
    id: number,
    content: string,
    appUser: IUser,
    repliedAt: string,
    likes: number
}

export interface IComment {
    id: number,
    appUser: IUser,
    content: string,
    commentedBy: string,
    commentedAt: string,
    likes: number,
    dislikes: number,
    replies: IReply[]
}

export interface ISession {
    id: number,
    active: boolean,
    endTime: string | null,
    users: string[]
}

export interface IPost {
    id: number,
    title: string,
    description: string,
    postedAt: string,
    gameId: number,
    gameName: string,
    appUser: IUser,
    platformId: number,
    platformName: string,
    comments: IComment[],
    sessions: ISession[],
    activeSession: boolean,
    thumbnailPath: string,
    thumbnailType: ThumbnailType
    views: number,
    likes: number,
    dislikes: number
}

export interface IDiscussion {
    id: number,
    postedAt: string,
    title: string,
    gameId: number,
    gameName: string,
    content: string,
    thumbnailPath: string,
    thumbnailType: ThumbnailType,
    otherImages: string[],
    videoPaths: string[],
    appUser: IUser,
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

export interface IUser {
    id: string,
    email: string,
    token: string,
    username: string,
    avatar: string,
    profileImage: string,
    likedPosts: number[],
    likedDiscussions: number[],
    likedComments: number[],
    likedDiscussionComments: number[],
    likedPostReplys: number[],
    likedDiscussionReplys: number[],
    following: IUser[];
    followers: IUser[];
    totalPostings: number;
}

export interface IImage {
    imagePath: string
}

export interface IAvatar {
    id: number,
    name: string
}

export interface INotification {
    id: number,
    type: number,
    engager: IUser,
    target: IUser,
    entityId: number | null,
    entityContent: string,
    createdAt: string,
    isRead: boolean
}

export enum Notification {
    Follow,
    PostCommentLike,
    DiscussionCommentLike,
    PostLike,
    DiscussionLike,
    PostComment,
    DiscussionComment,
    PostCommentReplyLike,
    DiscussionCommentReplyLike,
    ReplyPostComment,
    ReplyDiscussionComment
}

export enum ThumbnailType {
    Image,
    Video
}

export interface PostData {
  title?: string;
  description?: string;
  gameId?: number;
  platformId?: number;
  thumbnailSelected?: string;
  thumbnailUploaded?: Blob | MediaSource;
  otherMedia?: File[];
}

export interface PatchDataForPost {
    title?: string,
    description?: string,
    gameId?: number,
    platformId?: number,
    thumbnailPath?: string,
    thumbnailType?: ThumbnailType,
    thumbnailSelected?: string,
    thumbnailUploaded?: Blob | MediaSource
}

export interface PatchDataForDiscussion {
    title?: string,
    content?: string,
    gameId?: number,
    thumbnailPath?: string,
    thumbnailType?: ThumbnailType,
    thumbnailSelected?: string,
    thumbnailUploaded?: Blob | MediaSource,
    otherImages?: string[],
    videoPaths?: string[],
    otherMedia?: File[]
}