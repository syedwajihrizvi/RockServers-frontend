import { useGames } from "../hooks/useGames"
import { usePlatforms } from "../hooks/usePlatforms"
import useQueryStore from "../stores/useQueryStore"
import { capitalize } from "../utils/helpers/helpers"

export const Filters = () => {
  const {data:games, isLoading: isLoadingGames} = useGames()
  const {data:platforms, isLoading: isLoadingPlatforms} = usePlatforms()
  const { gameId, handleSetGameInfo, handleSetPlatformInfo, 
    handleSetPost, postType, platformId } = useQueryStore()

  const handleGameOptionSelect = (gameInfo: string) => {
    // Get gameId and gameName
    const splitInfo = gameInfo.split(',')
    const gameId = parseInt(splitInfo[0])
    if (gameId == -1)
      handleSetGameInfo(undefined, undefined)
    else {
      const gameName = splitInfo[1]
      handleSetGameInfo(gameId, gameName)
    }
  }

  const handlePlatformOptionSelect = (platformInfo: string) => {
    // Get gameId and gameName
    const splitInfo = platformInfo.split(',')
    const platformId = parseInt(splitInfo[0])
    const platformName = capitalize(splitInfo[1])
    handleSetPlatformInfo(platformId, platformName)
  }

  return (
    !isLoadingGames && !isLoadingPlatforms && games && platforms &&
    <div className="filters filter--games">
        <select  onChange={(event) => handleGameOptionSelect(event.target.value)}>
            <option value={-1}>All Games</option>
            {games.map(game => 
            <option 
              key={game.id} selected={game.id == gameId} value={`${game.id},${game.title}`}>
              {game.title}
            </option>)}
        </select>
        <div className="post-type-filter">
          <span className={`post-type-filter__span post-type-filter__span${postType == 'posts' ? '-white': '-dark'}`}
                onClick={() => handleSetPost('posts')}>
            Sessions
          </span>
          <span className={`post-type-filter__span post-type-filter__span${postType == 'discussions' ? '-white': '-dark'}`}
                onClick={() => handleSetPost('discussions')}>
            Discussions
          </span>
        </div>
        {postType == 'posts' && 
        <select onChange={(event) => handlePlatformOptionSelect(event.target.value)}>
          {platforms.map(platform => 
          <option 
            key={platform.id} selected={platform.id == platformId} 
            value={`${platform.id},${platform.name}`}>
            {capitalize(platform.name)}
          </option>)}
        </select>}
    </div>
  )
}
