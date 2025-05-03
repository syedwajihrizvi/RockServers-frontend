import { useNavigate, useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { formatStringDate, generateImageUrl, userDidLike, generateProfileImageUrl, generateVideoUrl } from '../utils/helpers/helpers'
import { ToastContainer, toast } from 'react-toastify'

import { Comments } from './Comments'
import { Engagements } from './Engagements'
import { useEffect, useState } from 'react'
import { IComment, IDiscussion, ThumbnailType } from '../utils/interfaces/Interfaces'
import { CiCirclePlus } from 'react-icons/ci'
import { PreviewCard } from './PreviewCard'
import apiClient from "../utils/services/dataServices"
import useQueryStore from '../stores/useQueryStore'
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useGlobalContext } from '../providers/global-provider'
import { useQueryClient } from '@tanstack/react-query'
import { useDiscussionComment } from '../hooks/useComments'
import { FollowButton } from './FollowButton'
import Placeholder from "../assets/images/placeholder.webp"

type Thumbnail = {
    urlPath: string,
    type: ThumbnailType
}

export const DiscussionDetails = () => {
  const {id: discussionId} = useParams()
  const {data: discussion, isLoading} = useDiscussion(parseInt(discussionId as string))
  const {data: discussionComments} = useDiscussionComment(parseInt(discussionId as string))
  const [thumbImage, setThumbImage] = useState<Thumbnail | null>(null)
  const [otherImages, setOtherImages] = useState<string[]>([])
  const [videoPaths, setVideoPaths] = useState<string[]>([])
  const [isLoadingSimilarDiscussions, setIsLoadingSimilarDiscussions] = useState(false)
  const [similarDiscussions, setSimilarDiscussions] = useState<IDiscussion[]>([])
  const { handleSetGameInfo, handleSetPost } = useQueryStore()
  const { isLoggedIn } = useGlobalContext()
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (discussion) {
        const { thumbnailPath, thumbnailType } = discussion
        setOtherImages([...discussion.otherImages ? discussion.otherImages : []])
        if (discussion.otherImages && thumbnailType == ThumbnailType.Image)
            setOtherImages([...otherImages, thumbnailPath])
        setVideoPaths([...discussion.videoPaths ? discussion.videoPaths : []])
        if (discussion.videoPaths && thumbnailType == ThumbnailType.Video)
            setVideoPaths([...videoPaths, thumbnailPath])
        setThumbImage({urlPath: thumbnailPath, type: thumbnailType})
    }
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

  const handleSubmitComment = (commentContent: string | undefined, comment: IComment | null) => {
    const jwtToken = localStorage.getItem('x-auth-token')
    if (comment) {
        apiClient.patch(
            `/discussionComments/${comment.id}/reply`, 
            {content: commentContent }, 
            {headers: {Authorization: `Bearer ${jwtToken}`}})
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["discussionComments", discussion?.id]})
            })
            .catch(err => console.log(err))
    } else {
        apiClient.post('/discussionComments', { content: commentContent, discussionId: discussion?.id},
            { headers: {Authorization: `Bearer ${jwtToken}`}})
       .then(() => {
          queryClient.invalidateQueries({ queryKey: ["discussionComments", discussion?.id]})
      })
       .catch(err => console.log(err))
    }
  }

  const renderDiscussionThumbnail = () => {
    if (thumbImage) {
        if (thumbImage?.type == ThumbnailType.Image)
            return <img className="post-card__img" src={generateImageUrl(thumbImage.urlPath)}/>
          return <video className="post-card__video" autoPlay={true} controls>
                  <source src={generateVideoUrl(thumbImage.urlPath)} type="video/mp4"/>
                </video>
    }
    return <img className='post-card__img' src={Placeholder}/>
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
                        {renderDiscussionThumbnail()}
                    </div>
                    <div className='discussion-details__other-images'>
                        {otherImages && otherImages.length > 0 
                        && otherImages.filter((img) => img != thumbImage?.urlPath).map(image => (
                            <img key={image} src={generateImageUrl(image)} 
                                 onClick={() => setThumbImage({urlPath: image, type: ThumbnailType.Image})}/>
                        ))}
                        {videoPaths && videoPaths.length > 0 
                        && videoPaths.filter((vid) => vid != thumbImage?.urlPath).map(video => (
                            <video autoPlay={true} loop={true} muted={true} controls={false}
                                  onClick={() => setThumbImage({urlPath: video, type: ThumbnailType.Video})}>
                                <source src={generateVideoUrl(video)} type="video/mp4"/>
                            </video>
                        ))}
                    </div>
                    <div className="card-details-card__content">
                        <div className="card-details-card__content__info">
                            <h3>{discussion.title}</h3>
                            <p>{discussion.content}</p>
                            <div className="card__user-info">
                                <img className="card__avatar" src={generateProfileImageUrl(discussion.appUser)} 
                                    alt="Avatar"/>
                                <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                            </div>
                        </div>
                        <Engagements comments={discussionComments} likes={discussion.likes} 
                                     handleLike={handleDiscussionLike}
                                     userLiked={userDidLike(user?.likedDiscussions, discussion.id)}/>
                    </div>
                </div>
                {discussionComments && 
                <Comments comments={discussionComments} 
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
            <FollowButton user={discussion.appUser}/>
         </div>    
        </div>
        </>}
    </div>
  )
}
