import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Post } from "../utils/interfaces/Interfaces";

function formatLikes(likes: number) {
    if (likes >= 1000000) {
      return (likes / 1000000).toFixed(1) + "M"; // Millions
    } else if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + "K"; // Thousands
    } else {
      return likes.toString(); // Return as-is for smaller numbers
    }
  }
export const PostCard = ({image, post}: {image: string, post: Post}) => {
  // Check if post has an active session

  return (
    <div className="post-card__wrapper">
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
                <span className="post-card__info">
                    <h1 className="post-card__poster">{post.appUser.username}</h1>
                    <span className="post-card__engagements">
                        <span className="post-card__comments">
                            <p>{post.comments.length} <FaComment className="icon"/></p>
                        </span>
                        <span className="post-card__likes">
                            <p>{formatLikes(post.likes)} <FaThumbsUp className="icon"/></p>
                        </span>
                    </span>
                </span>
                <p className="post-card__description">
                    {post.description}
                </p>
            </div>
        </div>
    </div>
  )
}
