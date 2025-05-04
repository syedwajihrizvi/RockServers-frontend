import { MdCancel } from "react-icons/md"
import { fileIsVideo } from "../utils/helpers/helpers"

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
