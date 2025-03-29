import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    platformId?: number,
    platformName?: string,
    gameName?: string,
    postType?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
    handleSetPlatformInfo: (platformId?: number, platformName?: string) => void,
    handleSetPost: (postType: string) => void
}

const useQueryStore = create<QueryStore>((set) => ({
    postType: 'posts',
    handleSetGameInfo: (gameId?: number, gameName?: string) => {
        set(() => (
            { gameId, gameName }
        ))
    },
    handleSetPost: (postType?: string) => {
        set(() => ({postType: postType}))
    },
    handleSetPlatformInfo(platformId?: number, platformName?: string) {
        set(() => (
            { platformId, platformName }
        ))
    },

}))

export default useQueryStore