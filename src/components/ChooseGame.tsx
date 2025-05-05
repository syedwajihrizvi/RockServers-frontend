import { useGames } from "../hooks/useGames"
export const ChooseGame = (
    {value, handleChange}: 
    {value: number | undefined, handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void}) => {
  
      const { data: games, isLoading: isLoadingGames } = useGames()
      return !isLoadingGames && games && (
        <select className="create-option" 
        value = {value || ""}
        onChange={(event) => handleChange(event)}>
            <option>Choose a Game</option>
            {games.map(game => 
            <option key={game.id} value={game.id}>{game.title}</option>)}
        </select>
  )
}
