import { useNavigate } from "react-router-dom"
import { formatStringDate, generateProfileImageUrl, generateImageUrl, renderPartialContent, generateVideoUrl } from '../utils/helpers/helpers'
import { IDiscussion, ThumbnailType } from '../utils/interfaces/Interfaces'
import { Engagements } from "./Engagements"
import { useGlobalContext } from "../providers/global-provider"
import Placeholder from "../assets/images/placeholder.webp"

export const DiscussionCard = ({discussion}: {discussion: IDiscussion}) => {
  const navigate = useNavigate()
  const { user } = useGlobalContext()

  const renderDiscussionThumbnail = () => {
    if (discussion.thumbnailPath) {
      if (discussion.thumbnailType == ThumbnailType.Image)
        return <img className="post-card__img" src={generateImageUrl(discussion.thumbnailPath)}/>
      return <video className="post-card__video" autoPlay={true} loop={true} muted={true}>
              <source src={generateVideoUrl(discussion.thumbnailPath)} type="video/mp4"/>
            </video>
    }
    return <img className="post-card__img" src={Placeholder}/>
  }

  return (
    <div className="post-card__wrapper" onClick={() => navigate(`/discussions/${discussion.id}`)}>
        <div className="post-card">
            {renderDiscussionThumbnail()}
            <div className="post-card__content">
                <span className="post-card__heading">
                    <h1 className="post-card__heading__title">{discussion.title}</h1>
                    <Engagements likes={discussion.likes} comments={discussion.comments}
                                 userLiked={user ? user.likedDiscussions.includes(discussion.id) : false}/>
                </span>
                <p className="post-card__description">
                    {renderPartialContent(discussion.content)}
                </p>
                <div className="post-card__footer">
                  <div className="card__user-info">
                    <img className="card__avatar" src={generateProfileImageUrl(discussion.appUser)} alt="Avatar"/>
                    <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}
