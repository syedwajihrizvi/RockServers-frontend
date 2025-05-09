import { useNavigate } from "react-router-dom"
import { formatStringDate, renderPartialContent } from '../utils/helpers/helpers'
import { IDiscussion, ThumbnailType } from '../utils/interfaces/Interfaces'
import { Engagements } from "./Engagements"
import { useGlobalContext } from "../providers/global-provider"
import { ProfileImage } from "./ProfileImage"
import { ImageViaUrl } from "./ImageViaUrl"
import { VideoViaUrl } from "./VideoViaUrl"

export const DiscussionCard = ({discussion}: {discussion: IDiscussion}) => {
  const navigate = useNavigate()
  const { user } = useGlobalContext()

  const renderDiscussionThumbnail = () => {
    if (discussion.thumbnailPath) {
      if (discussion.thumbnailType == ThumbnailType.Image)
        return <ImageViaUrl customClass="post-card__img" src={discussion.thumbnailPath}/>
      return <VideoViaUrl muted={true} controls={false} backupClass="post-card__video" customClass="post-card__video" url={discussion.thumbnailPath}/>
    }
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
                    <ProfileImage customClass="card__avatar" user={discussion.appUser}/>
                    <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}
