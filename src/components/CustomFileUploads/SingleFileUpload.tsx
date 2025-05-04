import { useRef } from "react";
import { FaUpload } from "react-icons/fa"

export const SingleFileUpload = (
    {label, handleFileUpload}: 
    {label: string, handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => boolean}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUploadWrapper =(event: React.ChangeEvent<HTMLInputElement>) => {
    const res = handleFileUpload(event)
    // Reset the file input value so selecting the same file again will trigger a change
    if (res) {
    if (fileInputRef.current)
      fileInputRef.current.value = ''
    }
  }

  return (
      <label className="file-upload-wrapper btn btn--success btn--md">
        {label} <FaUpload className="icon"/>
        <input ref={fileInputRef} type="file" onChange={(event) => handleFileUploadWrapper(event)}/>
      </label>  
  )
}
