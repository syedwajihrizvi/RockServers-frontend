export const CustomTimeInput = (
    {label, startTime, handleChange}: 
    {label: string, startTime: string | undefined, handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <>
        <label className="post-starting-time--label" htmlFor="post-starting-time">
            {label}
        </label>
        <input id="posts-starting-time" type="datetime-local" value={startTime} 
               className="create-input" onChange={(event) => handleChange(event)}/>
    </>
  )
}
