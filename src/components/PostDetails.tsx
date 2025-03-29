import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import apiClient from "../utils/services/dataServices"
import Avatar from "../assets/images/avatar.webp"
import { CiCirclePlus } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";

import { IComment, IPost } from "../utils/interfaces/Interfaces"
import { generateImageUrl, hasActiveSession } from "../utils/helpers/helpers";
import useQueryStore from "../stores/useQueryStore"
import { PostEngagements } from "./PostEngagements"
import { Skeleton } from "./Skeleton"
import { useEffect, useState } from "react"
import { Comment } from "./Comment"
import { toPlatformIcon } from "../utils/helpers/mappers";
import { PreviewCard } from "./PreviewCard";

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))
  const [isLoadingSimilarPosts, setIsLoadingSimilarPosts] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<IPost[]>([])
  const [viewAll, setViewAll] = useState(false)
  const [addingComment, setAddingComment] = useState(false)
  const { handleSetGameInfo } = useQueryStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (post) {
        setIsLoadingSimilarPosts(true)
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
        return hasActiveSession(post) ? 
            <button className="session-option btn btn--success btn--md">Join</button> : 
            <button className="session-option btn btn--danger btn--md">Join Queue</button>
  }

  const renderComments = (comments: IComment[]) =>
    comments.length < 2 || viewAll ? comments : comments.slice(0, 2)

  const handleSimilarPostClick = () => {
    if (post) {
        handleSetGameInfo(post.gameId, post.gameName)
        navigate('/')
    }
  }

  return (
    <div className="post-details__container">
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && post && 
        <div className="post-details-card__wrapper">
            <div className="post-details-card">
                <div className="post-details__img-wrapper">
                    <div className="post-card__rating post-card__rating--black post-card__rating--md">
                        <p>3.7</p>
                    </div>
                    <div className="post-details__platform">
                        {toPlatformIcon(post.platformName, 30, "white")}
                    </div>
                    {renderJoinButton()}
                    <img src={generateImageUrl(post.imagePath)} alt="post Image" className="post-details__img" />
                </div>
                <div className="post-details-card__content">
                    <div className="post-details-card__content__info">
                        <h3>{post.title}</h3>
                        <p>{post.description}</p>
                        <div className="post-card__user-info">
                            <img className="post-card__avatar" src={Avatar} 
                                alt="Avatar"/>
                            <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> 2hr ago.</p>
                        </div>
                    </div>
                    <PostEngagements post={post}/>
                </div>
                <div className="post-details-card__comments">
                    <h1>{post.comments.length} Comments</h1>
                    <div className="post-details-card__comments__add-wrapper">
                        <div className="post-details-card__comments__add">
                            <img src={Avatar} alt="Avatar"/>
                            <input type="text" placeholder="Add Comment..." 
                                   onFocus={() => setAddingComment(true)}
                                   onBlur={() => setAddingComment(false)}
                                   />
                        </div>
                        <div className={`button-group add-comment add-comment--${addingComment ?  'shown' : 'hidden'}`}>
                            <button className="btn btn--xs btn--success">Submit</button>
                            <button className="btn btn--xs btn--danger" 
                                    onClick={() => setAddingComment(false)}>
                                        Cancel
                            </button>
                        </div>
                    </div>
                    {renderComments(post.comments).map(comment => (
                        <Comment comment={comment}/>
                    ))}
                    {post.comments.length > 2 && 
                    <div className="comment__view-all">
                        <p>View All</p>
                        <MdFilterList className="icon" fontSize={20} onClick={() => setViewAll(!viewAll)}/>
                    </div>}
                </div>
            </div>
            <div className="similar-posts">
                <h3 className="similar-posts__heading">Similar Posts</h3>
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
            </div>
        </div>}
    </div>
  )
}
