import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    platformId?: number,
    platformName?: string,
    gameName?: string,
    postType?: string,
    searchValue?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
    handleSetPlatformInfo: (platformId?: number, platformName?: string) => void,
    handleSetPost: (postType: string) => void,
    handleSearch: (searchValue: string) => void
}

const useQueryStore = create<QueryStore>((set) => ({
    postType: 'posts',
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
    }
}))

export default useQueryStore