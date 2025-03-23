import { Post } from "../utils/interfaces/Interfaces";
import { useNavigate } from "react-router-dom";
import { PostEngagements } from "./PostEngagements";

export const PostCard = ({image, post}: {image: string, post: Post}) => {
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
                    <h1 className="post-card__date">2 hours ago</h1>
                </span>
                <PostEngagements post={post}/>
                <p className="post-card__description">
                    {post.description}
                </p>
            </div>
        </div>
    </div>
  )
}
