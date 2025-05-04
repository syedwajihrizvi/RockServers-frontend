import { Link } from "react-router-dom"
import { generateImageUrl, generateProfileImageUrl } from "../utils/helpers/helpers"
import { IDiscussion, IPost } from "../utils/interfaces/Interfaces"

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
        <img src={generateImageUrl(preview.thumbnailPath)}/>
        <div className="preview-card__title">
            <h3>{preview.title}</h3>
        </div>
      </div>
    </Link>
  )
}
