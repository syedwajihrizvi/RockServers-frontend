import { useNavigate, useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { formatStringDate, generateImageUrl, userDidLike } from '../utils/helpers/helpers'
import Avatar from "../assets/images/avatar.webp"
import { ToastContainer, toast } from 'react-toastify'

import { Comments } from './Comments'
import { Engagements } from './Engagements'
import { useEffect, useState } from 'react'
import { IDiscussion } from '../utils/interfaces/Interfaces'
import { CiCirclePlus } from 'react-icons/ci'
import { PreviewCard } from './PreviewCard'
import apiClient from "../utils/services/dataServices"
import useQueryStore from '../stores/useQueryStore'
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useGlobalContext } from '../providers/global-provider'
import { useQueryClient } from '@tanstack/react-query'
import { useDiscussionComment } from '../hooks/useComments'
import { FollowButton } from './FollowButton'

export const DiscussionDetails = () => {
  const {id: discussionId} = useParams()
  const {data: discussion, isLoading} = useDiscussion(parseInt(discussionId as string))
  const {data: discussionComments} = useDiscussionComment(parseInt(discussionId as string))
  const [thumbImage, setThumbImage] = useState('')
  const [isLoadingSimilarDiscussions, setIsLoadingSimilarDiscussions] = useState(false)
  const [similarDiscussions, setSimilarDiscussions] = useState<IDiscussion[]>([])
  const { handleSetGameInfo, handleSetPost } = useQueryStore()
  const { isLoggedIn } = useGlobalContext()
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const handleToastButtonClick = () => {
    navigate('/account/login')
  }

  const handleDiscussionLike = () => {
    if (!isLoggedIn) 
        toast(LoginToastComponent({action: "Like this Post", handleClick: handleToastButtonClick}), {autoClose: 5000})
    else {
        // Increment the discussion like
        apiClient.patch(`/discussions/${discussion?.id}/updateLikes`, !(user && discussion && userDidLike(user.likedDiscussions, discussion.id)), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`
            }
        }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["me"]})
            queryClient.invalidateQueries({queryKey: ['discussions', discussion?.id]})
        })
    }
  }

  const handleDiscussionComment = () => {
    if (!isLoggedIn)
        toast(LoginToastComponent({action: "Comment on this Post", handleClick: handleToastButtonClick}), {autoClose: 5000})
  }

  const handleSubmitComment = (commentContent: string | undefined) => {
    const jwtToken = localStorage.getItem('x-auth-token')
    apiClient.post('/discussionComments', { content: commentContent, discussionId: discussion?.id},
                  { headers: {Authorization: `Bearer ${jwtToken}`}})
             .then(() => {
                queryClient.invalidateQueries({ queryKey: ["discussionComments", discussion?.id]})
            })
             .catch(err => console.log(err))
  }
  return (
    <div className="card-details__container">
        <ToastContainer
            position="top-center"
            />
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && discussion &&
        <>
        <div className="card-details-card__wrapper post-details__wrapper">
            <div className="card-details-card">
                <div>
                    <div className="card-details__img-wrapper">
                        <img src={generateImageUrl(thumbImage ? thumbImage : discussion.imagePath)} 
                             alt="post Image" className="discussion-thumbnail" />
                    </div>
                    {discussion.otherImages && discussion.otherImages.length > 0 &&
                    <div className='discussion-details__other-images'>
                        {discussion.otherImages.map(image => (
                            <img key={image} src={generateImageUrl(image)} onClick={() => setThumbImage(image)}/>
                        ))}
                    </div>}
                    <div className="card-details-card__content">
                        <div className="card-details-card__content__info">
                            <h3>{discussion.title}</h3>
                            <p>{discussion.content}</p>
                            <div className="card__user-info">
                                <img className="card__avatar" src={Avatar} 
                                    alt="Avatar"/>
                                <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                            </div>
                        </div>
                        <Engagements comments={discussionComments} likes={discussion.likes} 
                                     handleLike={handleDiscussionLike}
                                     userLiked={userDidLike(user?.likedDiscussions, discussion.id)}/>
                    </div>
                </div>
                {discussionComments && <Comments comments={discussionComments} 
                          withViewAll={false} handleAddComment={handleDiscussionComment}
                          handleSubmitComment={handleSubmitComment}
                          commentType="discussionComments"/>}
            </div>
            <div>
            <div className="similar-posts">
                <h3 className="similar-posts__heading">{`Similar Posts for ${discussion.gameName}`}</h3>
                <div className="similar-posts__content">
                    {isLoadingSimilarDiscussions &&
                    [...Array(3).keys()].map((key) => 
                        <Skeleton key={`discussionSkeleton${key}`} customClass="skeleton skeleton--dynamic"/>)}
                    {!isLoadingSimilarDiscussions && similarDiscussions && 
                    similarDiscussions.map(post => <PreviewCard key={post.id} post={post}/>)
                    }
                    <CiCirclePlus 
                        fontSize={40} color="white" 
                        className="icon" onClick={() => handleSimilarDiscissionClick()}/>
                </div>
            </div> 
            <FollowButton username={discussion.appUser.username} avatar={discussion.appUser.avatar}/>
         </div>    
        </div>
        </>}
    </div>
  )
}
