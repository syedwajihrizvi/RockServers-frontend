import { useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { generateImageUrl } from '../utils/helpers/helpers'
import Avatar from "../assets/images/avatar.webp"
import { AddComment, Comments } from './Comments'
import { Engagements } from './Engagements'
import { useEffect, useState } from 'react'

export const DiscussionDetails = () => {
  const {id: discussionId} = useParams()
  const {data: discussion, isLoading} = useDiscussion(parseInt(discussionId as string))
  const [thumbImage, setThumbImage] = useState('')

  useEffect(() => {
    if (discussion?.imagePath)
        setThumbImage(discussion.imagePath)
  }, [isLoading, discussion])

  return (
    <div className="card-details__container">
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && discussion && 
        <div className="card-details-card__wrapper">
            <div className="card-details-card">
                <div>
                    <div className="card-details__img-wrapper">
                        <img src={generateImageUrl(thumbImage ? thumbImage : discussion.imagePath)} 
                             alt="post Image" className="discussion-thumbnail" />
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
                    {discussion.otherImages && discussion.otherImages.length > 0 &&
                    <div className='discussion-details__other-images'>
                        {discussion.otherImages.map(image => (
                            <img src={generateImageUrl(image)} onClick={() => setThumbImage(image)}/>
                        ))}
                    </div>}
                </div>
                {discussion.comments.length == 0 && 
                    <div className='card-details__no-comments'>
                        <h1>Be the first to comment</h1>
                        <AddComment/>
                    </div>}
            </div>
            {discussion.comments.length > 0 &&
            <Comments comments={[...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments,...discussion.comments, ...discussion.comments]} addFirst={false} withViewAll={false}/>}
        </div>}
    </div>
  )
}
