import { IPost } from "../utils/interfaces/Interfaces";
import { useNavigate } from "react-router-dom";
import { PostEngagements } from "./PostEngagements";
import Avatar from "../assets/images/avatar.webp"

export const PostCard = ({image, post}: {image: string, post: IPost}) => {
  // Check if post has an active session
  const navigate = useNavigate()
  return (
    <div className="post-card__wrapper" onClick={() => navigate(`/${post.id}`)}>
        <div className="post-card__rating">
            <p>3.7</p>
        </div>
        <div className="post-card__active"/>
        <div className="post-card">
            <img className="post-card__img" src={image}/>
            <div className="post-card__content">
                <span className="post-card__heading">
                    <h1 className="post-card__heading__title">{post.title}</h1>
                    <PostEngagements post={post}/>
                </span>
                <p className="post-card__description">
                    {post.description}
                </p>
                <div className="post-card__user-info">
                  <img className="post-card__avatar" src={Avatar} alt="Avatar"/>
                  <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> 2hr ago.</p>
                </div>
            </div>
        </div>
    </div>
  )
}
