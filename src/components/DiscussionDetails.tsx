import { useNavigate, useParams } from 'react-router-dom'
import { useDiscussion } from '../hooks/useDiscussions'
import { Skeleton } from './Skeleton'
import { formatStringDate, userDidLike } from '../utils/helpers/helpers'
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
import { DeleteButton } from './DeleteButton'
import { EditButton } from './EditButton'
import { ProfileImage } from './ProfileImage'
import { ImageViaUrl } from './ImageViaUrl'
import { VideoViaUrl } from './VideoViaUrl'

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
        const { thumbnailPath, thumbnailType, } = discussion
        if (discussion.otherImages) {
            setOtherImages([
                ...discussion.otherImages, 
                ...(thumbnailType == ThumbnailType.Image ? [thumbnailPath] : [])])
        }
        const videos = [...discussion.videoPaths ? discussion.videoPaths : []]
        if (discussion.videoPaths && thumbnailType == ThumbnailType.Video)
            videos.push(thumbnailPath)
        setVideoPaths([...videos])
        setThumbImage({urlPath: thumbnailPath, type: thumbnailType})
    }
  }, [isLoading, discussion])

  useEffect(() => {
    apiClient.patch(`/discussions/${discussionId}/updateViews`)
  }, [])

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
            return <ImageViaUrl key={thumbImage.urlPath} customClass='post-card__img' src={thumbImage.urlPath}/>
        else {
            return <VideoViaUrl key={thumbImage.urlPath} backupClass="post-card__video" muted={false} controls={true} customClass='post-card__video' url={thumbImage.urlPath}/>
        }
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
                            <ImageViaUrl key={image} src={image} handleClick={() => setThumbImage({urlPath: image, type: ThumbnailType.Image})}/>
                        ))}
                        {videoPaths && videoPaths.length > 0 
                        && videoPaths.filter((vid) => vid != thumbImage?.urlPath).map(video => (
                            <VideoViaUrl key={video} backupClass="" url={video} muted={true} controls={false} 
                                         handleClick={() => setThumbImage({urlPath: video, type: ThumbnailType.Video})}/>
                        ))}
                    </div>
                    <div className="card-details-card__content">
                        <div className="card-details-card__content__info">
                            <h3>{discussion.title}</h3>
                            <p>{discussion.content}</p>
                            <div className="card__user-info">
                                <ProfileImage customClass="card__avatar" user={discussion.appUser}/>
                                <p>Posted by <span style={{fontWeight:'bold'}}>{discussion.appUser.username}</span> {formatStringDate(discussion.postedAt)}</p>
                            </div>
                        </div>
                        <Engagements comments={discussionComments} likes={discussion.likes} views={discussion.views}
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
                <h3 className="similar-posts__heading">{`Similar Discussions for ${discussion.gameName}`}</h3>
                <div className="similar-posts__content">
                    {isLoadingSimilarDiscussions &&
                    [...Array(3).keys()].map((key) => 
                        <Skeleton key={`discussionSkeleton${key}`} customClass="skeleton skeleton--dynamic"/>)}
                    {!isLoadingSimilarDiscussions && similarDiscussions && 
                    similarDiscussions.map(post => <PreviewCard key={post.id} preview={post} type="discussions"/>)
                    }
                    <CiCirclePlus 
                        fontSize={40} color="white" 
                        className="icon" onClick={() => handleSimilarDiscissionClick()}/>
                </div>
            </div> 
            {
            discussion.appUser.username == user?.username && 
            <div className='detail-options__logged-in-user-container'>
                <EditButton type={"discussions"} contentId={discussion.id}/>
                <DeleteButton type="discussion" contentId={discussion.id}/>
            </div> }
            <FollowButton user={discussion.appUser}/>
         </div>    
        </div>
        </>}
    </div>
  )
}
