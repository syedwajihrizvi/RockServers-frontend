import { useNavigate } from "react-router-dom"
import Avatar from "../assets/images/avatar.webp"
import { generateImageUrl, renderPartialContent } from '../utils/helpers/helpers'
import { IDiscussion } from '../utils/interfaces/Interfaces'

export const DiscussionCard = ({discussion}: {discussion: IDiscussion}) => {
  const navigate = useNavigate()
  return (
    <div className="post-card__wrapper" onClick={() => navigate(`/discussions/${discussion.id}`)}>
        <div className="post-card">
            <img className="post-card__img" src={generateImageUrl(discussion.imagePath)}/>
            <div className="post-card__content">
                <span className="post-card__heading">
                    <h1 className="post-card__heading__title">{discussion.title}</h1>
                </span>
                <p className="post-card__description">
                    {renderPartialContent(discussion.content)}
                </p>
                <div className="post-card__footer">
                  <div className="card__user-info">
                    <img className="card__avatar" src={Avatar} alt="Avatar"/>
                    <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> 2hr ago.</p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}
