import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import apiClient from "../utils/services/dataServices"
import Avatar from "../assets/images/avatar.webp"
import { CiCirclePlus } from "react-icons/ci";
import { ToastContainer, toast } from 'react-toastify'

import { IPost } from "../utils/interfaces/Interfaces"
import { formatStringDate, generateImageUrl, getDateDifference, userDidLike } from "../utils/helpers/helpers";
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
import { useSessions } from "../hooks/useSessions";
import { useComment } from "../hooks/useComments";

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))
  const {data: successfullSessions } = useSessions(parseInt(postId as string), true, false)
  const {data: postComments} = useComment(parseInt(postId as string))
  const [isLoadingSimilarPosts, setIsLoadingSimilarPosts] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<IPost[]>([])
  const { handleSetGameInfo, handleSetPost } = useQueryStore()
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const { isLoggedIn } = useGlobalContext()
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
  
  const renderJoinButton = () => {
    if (post)
        return post.activeSession ? 
            <button className="session-option btn btn--success btn--md">Join</button> : 
            <button className="session-option btn btn--danger btn--md">Join Queue</button>
  }

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

  const handleSubmitComment = (commentContent: string | undefined) => {
    const jwtToken = localStorage.getItem('x-auth-token')
    apiClient.post('/comments', { title: "Title", content: commentContent, postId: postId},
                  { headers: {Authorization: `Bearer ${jwtToken}`}})
             .then(() => {
                queryClient.invalidateQueries({ queryKey: ["comments", post?.id]})
            })
             .catch(err => console.log(err))
  }

  return (
    <div className="card-details__container">
        <ToastContainer
            position="top-center"
            />
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
                    {renderJoinButton()}
                    <img src={generateImageUrl(post.imagePath)} alt="post Image" className="post-details__img" />
                </div>
                <div className="card-details-card__content">
                    <div className="card-details-card__content__info">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <div className="card__user-info">
                            <img className="card__avatar" src={Avatar} 
                                alt="Avatar"/>
                            <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> 2hr ago.</p>
                        </div>
                    </div>
                    <Engagements comments={post.comments} likes={post.likes} 
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
                    [...Array(3).keys()].map(() => 
                        <Skeleton customClass="skeleton skeleton--dynamic"/>)}
                    {!isLoadingSimilarPosts && similarPosts && 
                    similarPosts.map(post => <PreviewCard post={post}/>)
                    }
                    <CiCirclePlus 
                        fontSize={40} color="white" 
                        className="icon" onClick={() => handleSimilarPostClick()}/>
                </div>
                {successfullSessions && <div>
                    {successfullSessions.length > 0 ? 
                    <div className="post-session-history">
                        <h3 className="session-table__title">Session History</h3>
                        <h5 className="session-table__subtitle">{`This post has had ${successfullSessions.length}`} completed sessions.</h5>
                        <table className="session-table">
                            <tr className="session-table__header">
                                <th>Start</th>
                                <th>Duration</th>
                                <th>Player Count</th>
                                <th>Rating</th>
                            </tr>
                            {successfullSessions.map(session => {
                                return (
                                <tr className="session-table__data">
                                    <td>{formatStringDate(session.startTime)}</td>
                                    <td>{getDateDifference(session.startTime, session.endTime!)}</td>
                                    <td>{session.users.length}</td>
                                    <td>4.3</td>
                                </tr>)
                            })}
                        </table>
                    </div> : 
                    <h3>This post has not had any previous sessions.</h3>}
                </div>}
            </div>
        </div>}
    </div>
  )
}
