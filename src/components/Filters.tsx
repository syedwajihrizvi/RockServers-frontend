import { useGames } from "../hooks/useGames"
import useQueryStore from "../stores/useQueryStore"

export const Filters = () => {
  const {data:games, isLoading} = useGames()
  const { gameId, handleSetGameInfo, handleSetPost, postType } = useQueryStore()

  const handleGameOptionSelect = (gameInfo: string) => {
    // Get gameId and gameName
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
        <div className="post-type-filter">
          <span className={`post-type-filter__span post-type-filter__span${postType == 'posts' ? '-white': '-dark'}`}
                onClick={() => handleSetPost('posts')}>
            Posts
          </span>
          <span className={`post-type-filter__span post-type-filter__span${postType == 'discussions' ? '-white': '-dark'}`}
                onClick={() => handleSetPost('discussions')}>
            Discussions
          </span>
        </div>
        {postType == 'posts' && 
        <button className="btn btn--secondary btn--sm">
          Active Posts
        </button>}
    </div>
  )
}
