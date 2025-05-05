import { MdCancel } from "react-icons/md"
import { fileIsVideo, generateImageUrl, generateVideoUrl } from "../utils/helpers/helpers"
import { IDiscussion } from "../utils/interfaces/Interfaces"

export const MultipleMediaPreview = ({medias, handleClick}: {medias: File[], handleClick: (media: File) => void}) => {
    return (
      <div className="create-discussion__other-images">
        {medias.map(media => {
          return (
            <div className="create-discussion-other_images__wrapper">
              <MdCancel className="icon" onClick={() => handleClick(media)}/>
              {fileIsVideo(media) ? 
              <video autoPlay={true} loop={true} muted={true} controls={false}>
                  <source src={URL.createObjectURL(media)} type="video/mp4"/>
              </video>: 
              <img src={URL.createObjectURL(media)} />}
            </div>
          )
        })}
      </div>
    )
}

export const EditOtherImagePreviewPath = ({discussion, isEditing}: {discussion: IDiscussion, isEditing: boolean}) => {
  const {otherImages, videoPaths} = discussion
  return (
    <div className='discussion-details__other-images edit--other-images'>
        {otherImages && otherImages.length > 0 
        && otherImages.map(image => (
            <div className="create-discussion-other_images__wrapper">
              {isEditing && <MdCancel className="icon"/>}
              <img key={image} src={generateImageUrl(image)}/>
            </div>
        ))}
        {videoPaths && videoPaths.length > 0 
        && videoPaths.map(video => (
          <div className="create-discussion-other_images__wrapper">
            {isEditing && <MdCancel className="icon"/>}
            <video autoPlay={true} loop={true} muted={true} controls={false}>
                <source src={generateVideoUrl(video)} type="video/mp4"/>
            </video>
          </div>
        ))}
    </div>
  )
}
