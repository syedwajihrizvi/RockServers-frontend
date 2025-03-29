import { useGames } from "../hooks/useGames"
import useQueryStore from "../stores/useQueryStore"

export const Filters = () => {
  const {data:games, isLoading} = useGames()
  const { gameId, handleSetGameInfo } = useQueryStore()

  const handleGameOptionSelect = (gameInfo: string) => {
    // Get gameId and gameName
    console.log(gameInfo)
    const splitInfo = gameInfo.split(',')
    const gameId = parseInt(splitInfo[0])
    const gameName = splitInfo[1]
    if (gameId == 0)
      handleSetGameInfo(undefined, undefined)
    else
      handleSetGameInfo(gameId, gameName)
  }

  return (
    !isLoading && games && 
    <div className="filters filter--games">
        <select onChange={(event) => handleGameOptionSelect(event.target.value)}>
            <option value={0}>All Games</option>
            {games.map(game => 
            <option 
              key={game.id} selected={game.id == gameId} value={`${game.id},${game.title}`}>
              {game.title}
            </option>)}
        </select>
        <select onChange={(event) => console.log(event.target.value)}>
            <option value={0}>All Posts</option>
            <option>Posts</option>
            <option>Discussions</option>
        </select>
        <button className="btn btn--secondary btn--sm">
            Active
        </button>
    </div>
  )
}
