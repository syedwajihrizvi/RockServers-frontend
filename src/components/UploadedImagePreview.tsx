import { MdCancel } from "react-icons/md"
import { fileIsVideo, generateImageUrl, generateVideoUrl } from "../utils/helpers/helpers"
import { ThumbnailType } from "../utils/interfaces/Interfaces"

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

export const ThumbnailImagePreviewViewPath = (
  {thumbnailPath, thumbnailType}: {thumbnailPath: string, thumbnailType: ThumbnailType}) => {
    return (
      thumbnailType == ThumbnailType.Video ?
      <video autoPlay={true} muted={true} controls={true}>
        <source src={generateVideoUrl(thumbnailPath)} type="video/mp4"/>
      </video> :
      <img src={generateImageUrl(thumbnailPath)}/>
      )

}