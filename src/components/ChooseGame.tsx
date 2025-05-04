import { IGame } from "../utils/interfaces/Interfaces"

export const ChooseGame = (
    {value, games, handleChange}: 
    {value: number | undefined, games: IGame[], handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void}) => {
  return (
    <select className="create-option" 
    value = {value || ""}
    onChange={(event) => handleChange(event)}>
        <option>Choose a Game</option>
        {games.map(game => 
        <option key={game.id} value={game.id}>{game.title}</option>)}
    </select>
  )
}
