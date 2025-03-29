import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    gameName?: string,
    postType?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
    handleSetPost: (postType: string) => void
}

const useQueryStore = create<QueryStore>((set) => ({
    postType: 'posts',
    handleSetGameInfo: (gameId?: number, gameName?: string) => {
        set(() => (
            { gameId: gameId, 
              gameName: gameName }
        ))
    },
    handleSetPost: (postType?: string) => {
        set(() => ({postType: postType}))
    }

}))

export default useQueryStore