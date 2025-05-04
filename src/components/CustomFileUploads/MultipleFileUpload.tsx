import { useRef } from "react";
import { FaUpload } from "react-icons/fa6"

export const MultipleFileUpload = (
    {label, handleMultipleFileUpload}: 
    {label: string, handleMultipleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => boolean}) => {
  const multipleFileInputRef = useRef<HTMLInputElement | null>(null);
  const handleMultipleFileUploadWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    const res = handleMultipleFileUpload(event)
    if (res) {
      if (multipleFileInputRef.current)
        multipleFileInputRef.current.value = ''
    }
  }

  return (
        <label className="file-upload-wrapper btn btn--success btn--md">
        {label} <FaUpload className="icon"/>
        <input ref={multipleFileInputRef} type="file" multiple onChange={(event) => handleMultipleFileUploadWrapper(event)}/>
        </label>
  )
}
