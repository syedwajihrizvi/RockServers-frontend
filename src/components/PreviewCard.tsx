import { Link } from "react-router-dom"
import { generateImageUrl, generateProfileImageUrl, generateVideoUrl } from "../utils/helpers/helpers"
import { IDiscussion, IPost, ThumbnailType } from "../utils/interfaces/Interfaces"

export const PreviewCard = ({preview, type}: {preview: IPost | IDiscussion, type: "discussions" | "posts"}) => {
  return (
    <Link to={`/${type}/${preview.id}`} style={{textDecoration: 'none'}}>
      <div className="preview-card">
        <div className="post-card__rating post-card__rating--green post-card__rating--sm">
            <h4>4.2</h4>
        </div>
        <div className="preview-card__user-info">
            <img src={generateProfileImageUrl(preview.appUser)} alt="User Info" />
        </div>
        {
        preview.thumbnailType == ThumbnailType.Image ?  
        <img src={generateImageUrl(preview.thumbnailPath)}/> :
         <video autoPlay={true} loop={true} muted={true} disablePictureInPicture >
              <source src={generateVideoUrl(preview.thumbnailPath)} type="video/mp4"/>
          </video>
        }
        <div className="preview-card__title">
            <h3>{preview.title}</h3>
        </div>
      </div>
    </Link>
  )
}
