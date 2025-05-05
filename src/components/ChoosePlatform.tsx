
export const ChoosePlatform = (
    {value, handleChange}: 
    {value: number | undefined, handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void}) => {
    return (
        <select 
            className="create-option" 
            value = {value || ""}
            onChange={(event) => handleChange(event)}>
            <option>What Platform</option>
            <option value="2">Playstation</option>
            <option value="0">XBox</option>
            <option value="1">PC</option>
        </select>
    ) 
}
