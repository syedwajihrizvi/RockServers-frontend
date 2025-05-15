import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    platformId?: number,
    platformName?: string,
    gameName?: string,
    postType?: string,
    searchValue?: string,
    sessionType?: string,
    orderBy?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
    handleSetPlatformInfo: (platformId?: number, platformName?: string) => void,
    handleSetPost: (postType: string) => void,
    handleSearch: (searchValue: string) => void,
    handleSetSessionType: (sessionType: string) => void,
    handleSetOrderBy: (orderBy?: string) => void,
    handleResetAll: () => void
}

const defaulState = {
    gameId: undefined,
    platformId: undefined,
    platformName: undefined,
    gameName: undefined,
    postType: 'discussions',
    searchValue: undefined,
    sessionType: 'all',
    orderBy: 'recent',  
}

const useQueryStore = create<QueryStore>((set) => ({
    postType: 'discussions',
    sessionType: 'all',
    orderBy: 'recent',
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
    handleSetOrderBy: (orderBy?: string) => {
        set((state) => ({...state, orderBy}))
    },
    handleResetAll: () => {
        set(() => ({...defaulState}))
    }
}))

export default useQueryStore