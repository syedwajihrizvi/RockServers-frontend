import { Link, useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import apiClient from "../utils/services/dataServices"
import { CiCirclePlus } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify'

import { IComment, IPost, ThumbnailType } from "../utils/interfaces/Interfaces"
import { formatStringDate, userDidLike } from "../utils/helpers/helpers";
import useQueryStore from "../stores/useQueryStore"
import { Engagements } from "./Engagements"
import { Skeleton } from "./Skeleton"
import { useEffect, useState } from "react"
import { toPlatformIcon } from "../utils/helpers/mappers";
import { PreviewCard } from "./PreviewCard";
import { Comments } from "./Comments";
import { useGlobalContext } from "../providers/global-provider";
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useQueryClient } from "@tanstack/react-query";
import { useComment } from "../hooks/useComments";
import { FollowButton } from "./FollowButton";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { ProfileImage } from "./ProfileImage";
import { ImageViaUrl } from "./ImageViaUrl";
import { VideoViaUrl } from "./VideoViaUrl";

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))
  const {data: postComments} = useComment(parseInt(postId as string))
  const [isLoadingSimilarPosts, setIsLoadingSimilarPosts] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<IPost[]>([])
  const { handleSetGameInfo, handleSetPost } = useQueryStore()
  const { user, isLoggedIn } = useGlobalContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (post) {
        apiClient.get<IPost[]>(
            '/posts', 
            {params: {
                gameId: post.gameId,
                limit: 3,
                postToRemoveId: post.id}})
        .then(res => {
            setSimilarPosts(res.data)
        })
        .catch(() => setSimilarPosts([...similarPosts]))
        .finally(() => setIsLoadingSimilarPosts(false))
    }
  }, [post])


  if (!postId) {
    navigate('/')
  }
  
  useEffect(() => {
    apiClient.patch(`/posts/${postId}/updateViews`)
  }, [])

  const handleSimilarPostClick = () => {
    if (post) {
        handleSetGameInfo(post.gameId, post.gameName)
        handleSetPost('posts')
        navigate('/')
    }
  }

  const handleToastButtonClick = () => {
    navigate('/account/login')
  }

  const handlePostLike = () => {
    if (!isLoggedIn) 
        toast(LoginToastComponent({action: "Like this Post", handleClick: handleToastButtonClick}), {autoClose: 5000})
    else {
        // Increment the post like
        apiClient.patch(`/posts/${post?.id}/updateLikes`, !(user && post && userDidLike(user.likedPosts, post.id)), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`
            }
          }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["me"]})
            queryClient.invalidateQueries({ queryKey: ["posts", post?.id]})
         }).catch(err => console.log(err))
    }
  }

  const handlePostComment = () => {
    if (!isLoggedIn)
        toast(LoginToastComponent({action: "Comment on this Post", handleClick: handleToastButtonClick}), {autoClose: 5000})
  }

  const handleSubmitComment = (commentContent: string | undefined, comment: IComment | null) => {
    const jwtToken = localStorage.getItem('x-auth-token')
    if (comment) {
        apiClient.patch(
            `/comments/${comment.id}/reply`, 
            {content: commentContent }, 
            {headers: {Authorization: `Bearer ${jwtToken}`}})
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ["comments", post?.id]})
            })
            .catch(err => console.log(err))
    }
    else {
        apiClient.post('/comments', { title: "Title", content: commentContent, postId: postId},
                    { headers: {Authorization: `Bearer ${jwtToken}`}})
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["comments", post?.id]})
                })
                .catch(err => console.log(err))
    }
  }

    const renderPostCardThumbnail = (post: IPost) =>
      post.thumbnailType == ThumbnailType.Image ?
                            <ImageViaUrl customClass="post-details__img" src={post.thumbnailPath}/> :
                            <VideoViaUrl muted={false} controls={true} backupClass="post-details__img" customClass="post-details__video" url={post.thumbnailPath}/>

  return (
    <div className="card-details__container">
        <ToastContainer position="top-center"/>
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && post && 
        <div className="card-details-card__wrapper post-details__wrapper">
            <div className="card-details-card">
                <div className="card-details__img-wrapper">
                    <div className="post-card__rating post-card__rating--black post-card__rating--md">
                        <p>3.7</p>
                    </div>
                    <div className="card-details__platform">
                        {toPlatformIcon(post.platformName, 30, "white")}
                    </div>
                    {renderPostCardThumbnail(post)}
                </div>
                <div className="card-details-card__content">
                    <div className="card-details-card__content__info">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <Link to={`/profile/${post.appUser.username}`}>
                            <div className="card__user-info">
                            <ProfileImage customClass="card__avatar" user={post.appUser}/>
                            <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> {formatStringDate(post.postedAt)}</p>
                            </div>
                        </Link>
                    </div>
                    <Engagements comments={postComments} likes={post.likes} views={post.views}
                                 userLiked={userDidLike(user?.likedPosts, post.id)} handleLike={handlePostLike}/>
                </div>
                {
                postComments &&
                <Comments comments={postComments} 
                withViewAll={true} 
                handleAddComment={handlePostComment} 
                handleSubmitComment={handleSubmitComment}
                commentType="comments"/>
                }
            </div>
            <div className="similar-posts">
                <h3 className="similar-posts__heading">{`Similar Posts for ${post.gameName}`}</h3>
                <div className="similar-posts__content">
                    {isLoadingSimilarPosts &&
                    [...Array(3).keys()].map((key) => 
                        <Skeleton key={key} customClass="skeleton skeleton--dynamic"/>)}
                    {!isLoadingSimilarPosts && similarPosts && 
                    similarPosts.map(post => <PreviewCard key={post.id} preview={post} type="posts"/>)
                    }
                    <CiCirclePlus 
                        fontSize={40} color="white" 
                        className="icon" onClick={() => handleSimilarPostClick()}/>
                </div>
                {post.appUser.username == user?.username &&
                <div className="detail-options__logged-in-user-container">
                    <EditButton type={"posts"} contentId={post.id}/>
                    <DeleteButton type="post" contentId={post.id}/>
                </div>}
                <FollowButton user={post.appUser}/>
            </div>
        </div>}
    </div>
  )
}
