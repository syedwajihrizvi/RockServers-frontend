import { useNavigate } from "react-router-dom"
import Avatar from "../assets/images/avatar.webp"
import { formatStringDate, generateImageUrl, renderPartialContent } from '../utils/helpers/helpers'
import { IDiscussion } from '../utils/interfaces/Interfaces'
import { Engagements } from "./Engagements"
import { useGlobalContext } from "../providers/global-provider"

export const DiscussionCard = ({discussion}: {discussion: IDiscussion}) => {
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  return (
    <div className="post-card__wrapper" onClick={() => navigate(`/discussions/${discussion.id}`)}>
        <div className="post-card">
            <img className="post-card__img" src={generateImageUrl(discussion.imagePath)}/>
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
                    <img className="card__avatar" src={Avatar} alt="Avatar"/>
                    <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}
