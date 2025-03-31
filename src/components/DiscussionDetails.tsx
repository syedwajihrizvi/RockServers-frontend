import { useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { generateImageUrl } from '../utils/helpers/helpers'
import Avatar from "../assets/images/avatar.webp"
import { Comments } from './Comments'
import { Engagements } from './Engagements'

export const DiscussionDetails = () => {
  const {id: discussionId} = useParams()
  const {data: discussion, isLoading} = useDiscussion(parseInt(discussionId as string))

  return (
    <div className="card-details__container">
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && discussion && 
        <div className="card-details-card__wrapper">
            <div className="card-details-card">
                <div>
                    <div className="card-details__img-wrapper">
                        <img src={generateImageUrl(discussion.imagePath)} alt="post Image" className="post-details__img" />
                    </div>
                    <div className="card-details-card__content">
                        <div className="card-details-card__content__info">
                            <h3>{discussion.title}</h3>
                            <p>{discussion.content}</p>
                            <div className="card__user-info">
                                <img className="card__avatar" src={Avatar} 
                                    alt="Avatar"/>
                                <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> 2hr ago.</p>
                            </div>
                        </div>
                        <Engagements comments={discussion.comments} likes={discussion.likes}/>
                    </div>
                </div>
            </div>
            <Comments comments={[...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments]} addFirst={false} withViewAll={false}/>
        </div>}
    </div>
  )
}
