import { FaComment, FaThumbsUp } from 'react-icons/fa'
import { Post } from '../utils/interfaces/Interfaces'

function formatLikes(likes: number) {
    if (likes >= 1000000) {
        return (likes / 1000000).toFixed(1) + "M"; // Millions
    } else if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + "K"; // Thousands
    } else {
        return likes.toString(); // Return as-is for smaller numbers
    }
}

export const PostEngagements = ({post}: {post: Post}) => {
  return (
        <span className="post-card__engagements">
            <span className="post-card__comments">
                <p>{post?.comments.length} <FaComment className="icon"/></p>
            </span>
            <span className="post-card__likes">
                <p>{formatLikes(post?.likes as number)} <FaThumbsUp className="icon"/></p>
            </span>
        </span>
  )
}
