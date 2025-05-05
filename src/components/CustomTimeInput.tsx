import { useState } from "react"
import { FaEdit } from "react-icons/fa"
import { MdEditOff } from "react-icons/md";

export const CustomTimeInput = (
    {label, startTime, handleChange}: 
    {label: string, startTime: string | undefined, handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <>
        <label className="post-starting-time--label" htmlFor="post-starting-time">
            <h3 className="current-thumbnail__heading">{label}</h3>
        </label>
        <input id="posts-starting-time" type="datetime-local" value={startTime} 
               className="create-input" onChange={(event) => handleChange(event)}/>
    </>
  )
}

export const CustomInput = (
  {label, placeholder, handleChange}: 
  {label: string, placeholder: string, handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void}) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div>
      <div className="custom-input__label">
        <label className="post-starting-time--label">
          <h3 className="current-thumbnail__heading">{label}</h3>
        </label>
        {!isEditing && <FaEdit className="current-thumbnail__icon" onClick={() => setIsEditing(true)}/>}
        {isEditing && <MdEditOff className="current-thumbnail__icon" style={{color: 'red'}} onClick={() => setIsEditing(false)}/>}
      </div>
      <input className="create-input custom-input" 
        placeholder={placeholder}
        onChange={handleChange}
        disabled={!isEditing}/>
    </div>
  )
}

export const CustomTextArea = (
  {label, placeholder, handleChange}:
  {label: string, placeholder: string, handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void}
) => {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div>
      <div className="custom-input__label">
        <label>
          <h3 className="current-thumbnail__heading">{label}</h3>
        </label>
        {!isEditing && <FaEdit className="current-thumbnail__icon"  onClick={() => setIsEditing(true)}/>}
        {isEditing && <MdEditOff className="current-thumbnail__icon" style={{color: 'red'}} onClick={() => setIsEditing(false)}/>}
      </div>
      <textarea 
          placeholder={placeholder} 
          className="create-textarea custom-textarea"
          onChange={handleChange}
          disabled={!isEditing}/>
    </div>
  )
}
