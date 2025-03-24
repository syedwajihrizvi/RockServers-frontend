import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "../hooks/usePosts"
import Avatar from "../assets/images/avatar.webp"
import Placeholder from "../assets/images/placeholder.webp"
import { FaHeart, FaThumbsDown } from 'react-icons/fa'

import { PostEngagements } from "./PostEngagements"
import { Skeleton } from "./Skeleton"

export const PostDetails = () => {
  const {id: postId} = useParams()
  const {data:post, isLoading} = usePost(parseInt(postId as string))

  const navigate = useNavigate()
  if (!postId) {
    navigate('/')
  }

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
                            <img className="post-card__avatar" src={Avatar} alt="Avatar"/>
                            <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> 2hr ago.</p>
                        </div>
                    </div>
                    <PostEngagements post={post}/>
                </div>
                <div className="post-details-card__comments">
                    <h1>{post.comments.length} Comments</h1>
                    {post.comments.map(comment => (
                        <div>
                            <div className="comment">
                                <div className="comment__content">
                                    <div className="comment__content__user-info">
                                        <img src={Avatar} alt="Comment User Avatar"/>
                                    </div>
                                    <div className="comment__content__content">
                                        <h5 className="comment__content__content__user">{comment.commentedBy}</h5>
                                        <p className="comment__content__content__comment">{comment.content}</p>
                                        <p className="comment__content__content__date">9hr ago</p>
                                    </div>
                                </div>
                                <div className="comment__engagement">
                                    <span><FaHeart fontSize={12} className="icon" color='red'/><p>{comment.likes}</p></span>
                                    <span><FaThumbsDown fontSize={12} className="icon"/></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>}
    </div>
  )
}
