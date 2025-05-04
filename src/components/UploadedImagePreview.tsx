import { MdCancel } from "react-icons/md"
import { fileIsVideo } from "../utils/helpers/helpers"

export const UploadedImagePreview = (
    {thumbnail, handleClick}: {thumbnail: Blob | MediaSource, handleClick:() => void}) => {
      const imageUrl = URL.createObjectURL(thumbnail)
      return (
      <div className="create-post__img--selected__wrapper">
        <MdCancel className="icon" onClick={handleClick}/>
        {fileIsVideo(thumbnail as File) ? 
        <video autoPlay={true} muted={true} controls={true}>
          <source src={imageUrl} type="video/mp4"/>
        </video> : <img src={imageUrl}/>}
      </div>
      )
}
 