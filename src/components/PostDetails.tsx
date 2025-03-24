import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import Avatar from "../assets/images/avatar.webp"
import Placeholder from "../assets/images/placeholder.webp"
import { MdFilterList } from "react-icons/md";

import { IComment } from "../utils/interfaces/Interfaces"
import { PostEngagements } from "./PostEngagements"
import { Skeleton } from "./Skeleton"
import { useState } from "react"
import { Comment } from "./Comment"

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))
  const [viewAll, setViewAll] = useState(false)
  const [addingComment, setAddingComment] = useState(false)
  const navigate = useNavigate()
  if (!postId) {
    navigate('/')
  }
 
  const renderComments = (comments: IComment[]) =>
    comments.length < 10 || viewAll ? comments : comments.slice(0, 3)

  return (
    <div>
        {isLoading && <Skeleton customClass="skeleton--lg"/>}
        {!isLoading && post && 
        <div className="post-details-card__wrapper">
            <div className="post-details-card">
                <div className="post-card__rating">
                    <p>3.7</p>
                </div>
                <img src={Placeholder} alt="post Image" className="post-details__img" />
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
                        {addingComment && 
                        <div className="button-group">
                            <button className="btn btn--xs btn--success">Submit</button>
                            <button className="btn btn--xs btn--danger" 
                                    onClick={() => setAddingComment(false)}>Cancel</button>
                        </div>}
                    </div>
                    {renderComments(post.comments).map(comment => (
                        <Comment comment={comment}/>
                    ))}
                    {post.comments.length > 10 && 
                    <div className="comment__view-all">
                        <p>View All</p>
                        <MdFilterList className="icon" fontSize={20} onClick={() => setViewAll(!viewAll)}/>
                    </div>}
                </div>
            </div>
        </div>}
    </div>
  )
}
