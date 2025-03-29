import { create } from 'zustand'

interface QueryStore {
    gameId?: number,
    gameName?: string,
    handleSetGameInfo: (gameId?: number, gameName?: string) => void
}

const useQueryStore = create<QueryStore>((set) => ({
    handleSetGameInfo: (gameId?: number, gameName?: string) => {
        set(() => (
            { gameId: gameId, 
              gameName: gameName }
        ))
    }

}))

export default useQueryStore