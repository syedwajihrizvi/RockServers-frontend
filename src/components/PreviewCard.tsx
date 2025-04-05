import { useNavigate } from "react-router-dom"
import { generateImageUrl } from "../utils/helpers/helpers"
import { IDiscussion, IPost } from "../utils/interfaces/Interfaces"
import Avatar from "../assets/images/avatar.webp"

export const PreviewCard = ({post}: {post: IPost | IDiscussion}) => {
  const navigate = useNavigate()
  return (
    <div className="preview-card" onClick={() => navigate(`/${post.id}`)}>
        <div className="post-card__rating post-card__rating--green post-card__rating--sm">
            <h4>4.2</h4>
        </div>
        <div className="preview-card__user-info">
            <img src={Avatar} alt="User Info" />
        </div>
        <img src={generateImageUrl(post.imagePath)}/>
        <div className="preview-card__title">
            <h3>{post.title}</h3>
        </div>
    </div>
  )
}
