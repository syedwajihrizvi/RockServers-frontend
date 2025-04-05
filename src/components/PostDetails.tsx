import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import apiClient from "../utils/services/dataServices"
import Avatar from "../assets/images/avatar.webp"
import { CiCirclePlus } from "react-icons/ci";

import { IPost, ISession } from "../utils/interfaces/Interfaces"
import { formatStringDate, generateImageUrl, getDateDifference, getSuccessfulSessions } from "../utils/helpers/helpers";
import useQueryStore from "../stores/useQueryStore"
import { Engagements } from "./Engagements"
import { Skeleton } from "./Skeleton"
import { useEffect, useState } from "react"
import { toPlatformIcon } from "../utils/helpers/mappers";
import { PreviewCard } from "./PreviewCard";
import { Comments } from "./Comments";

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))
  const [isLoadingSimilarPosts, setIsLoadingSimilarPosts] = useState(false)
  const [successfullSessions, setSuccessfullSessions] = useState<ISession[]>([])
  const [similarPosts, setSimilarPosts] = useState<IPost[]>([])
  const { handleSetGameInfo } = useQueryStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (post) {
        setIsLoadingSimilarPosts(true)
        setSuccessfullSessions(getSuccessfulSessions(post))
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
        navigate('/')
    }
  }

  return (
    <div className="card-details__container">
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
                    <Engagements comments={post.comments} likes={post.likes}/>
                </div>
                <Comments comments={post.comments} addFirst={true} withViewAll={true}/>
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
                <div>
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
                </div>
            </div>
        </div>}
    </div>
  )
}
