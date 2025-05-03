import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    platformId?: number,
    platformName?: string,
    gameName?: string,
    postType?: string,
    searchValue?: string,
    sessionType?: string,
    mostRecent: boolean,
    orderBy?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
    handleSetPlatformInfo: (platformId?: number, platformName?: string) => void,
    handleSetPost: (postType: string) => void,
    handleSearch: (searchValue: string) => void,
    handleSetSessionType: (sessionType: string) => void,
    handleSetMostRecent: () => void,
    handleSetOrderBy: (orderBy?: string) => void,
    handleResetAll: () => void
}

const defaulState = {
    gameId: undefined,
    platformId: undefined,
    platformName: undefined,
    gameName: undefined,
    postType: 'posts',
    searchValue: undefined,
    sessionType: 'all',
    mostRecent: false,
    orderBy: undefined,  
}

const useQueryStore = create<QueryStore>((set) => ({
    postType: 'posts',
    sessionType: 'all',
    mostRecent: false,
    handleSetGameInfo: (gameId?: number, gameName?: string) => {
        set((state) => ({ ...state, gameId, gameName }))
    },
    handleSetPost: (postType?: string) => {
        set((state) => ({...state, postType}))
    },
    handleSetPlatformInfo(platformId?: number, platformName?: string) {
        set((state) => (
            { ...state, platformId, platformName }
        ))
    },
    handleSearch: (searchValue?: string) => {
        set((state) => ({...state, searchValue}))
    },
    handleSetSessionType: (sessionType?: string) => {
        set((state) => ({...state, sessionType}))
    },
    handleSetMostRecent: () => {
        set((state) => ({...state, mostRecent: !state.mostRecent}))
    },
    handleSetOrderBy: (orderBy?: string) => {
        set((state) => ({...state, orderBy}))
    },
    handleResetAll: () => {
        set(() => ({...defaulState}))
    }
}))

export default useQueryStore