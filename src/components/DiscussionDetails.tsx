import { useNavigate, useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { generateImageUrl } from '../utils/helpers/helpers'
import Avatar from "../assets/images/avatar.webp"
import { AddComment, Comments } from './Comments'
import { Engagements } from './Engagements'
import { useEffect, useState } from 'react'
import { IDiscussion } from '../utils/interfaces/Interfaces'
import { CiCirclePlus } from 'react-icons/ci'
import { PreviewCard } from './PreviewCard'
import apiClient from "../utils/services/dataServices"
import useQueryStore from '../stores/useQueryStore'

export const DiscussionDetails = () => {
  const {id: discussionId} = useParams()
  const {data: discussion, isLoading} = useDiscussion(parseInt(discussionId as string))
  const [thumbImage, setThumbImage] = useState('')
  const [isLoadingSimilarDiscussions, setIsLoadingSimilarDiscussions] = useState(false)
  const [similarDiscussions, setSimilarDiscussions] = useState<IDiscussion[]>([])
  const { handleSetGameInfo, handleSetPost } = useQueryStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (discussion?.imagePath)
        setThumbImage(discussion.imagePath)
  }, [isLoading, discussion])

  useEffect(() => {
    if (discussion) {
        setIsLoadingSimilarDiscussions(true)
        apiClient.get<IDiscussion[]>(
            '/discussions',
            {params: {
                gameId: discussion.gameId,
                limit: 3,
                discussionToRemoveId: discussion.id
            }}
        )
        .then(res => setSimilarDiscussions(res.data))
        .catch(() => setSimilarDiscussions([...similarDiscussions]))
        .finally(() => setIsLoadingSimilarDiscussions(false))

    }
  }, [discussion])

  const handleSimilarDiscissionClick = () => {
    if (discussion) {
        handleSetGameInfo(discussion.gameId, discussion.gameName)
        handleSetPost('discussions')
        navigate('/')
    }
  }

  return (
    <div className="card-details__container">
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && discussion &&
        <>
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
        </div>
        <div className="similar-posts">
                <h3 className="similar-posts__heading">{`Similar Posts for ${discussion.gameName}`}</h3>
                <div className="similar-posts__content">
                    {isLoadingSimilarDiscussions &&
                    [...Array(3).keys()].map(() => 
                        <Skeleton customClass="skeleton skeleton--dynamic"/>)}
                    {!isLoadingSimilarDiscussions && similarDiscussions && 
                    similarDiscussions.map(post => <PreviewCard post={post}/>)
                    }
                    <CiCirclePlus 
                        fontSize={40} color="white" 
                        className="icon" onClick={() => handleSimilarDiscissionClick()}/>
                </div>
            </div> 
        </>}
    </div>
  )
}
