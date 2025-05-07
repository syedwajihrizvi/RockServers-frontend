import { Link } from "react-router-dom"
import { IDiscussion, IPost, ThumbnailType } from "../utils/interfaces/Interfaces"
import { ProfileImage } from "./ProfileImage"
import { ImageViaUrl } from "./ImageViaUrl"
import { VideoViaUrl } from "./VideoViaUrl"

export const PreviewCard = ({preview, type}: {preview: IPost | IDiscussion, type: "discussions" | "posts"}) => {
  return (
    <Link to={`/${type}/${preview.id}`} style={{textDecoration: 'none'}}>
      <div className="preview-card">
        <div className="post-card__rating post-card__rating--green post-card__rating--sm">
            <h4>4.2</h4>
        </div>
        <div className="preview-card__user-info">
            <ProfileImage user={preview.appUser}/>
        </div>
        {
        preview.thumbnailType == ThumbnailType.Image ?  
        <ImageViaUrl src={preview.thumbnailPath}/> :
        <VideoViaUrl backupClass="" url={preview.thumbnailPath}/>
        }
        <div className="preview-card__title">
            <h3>{preview.title}</h3>
        </div>
      </div>
    </Link>
  )
}
