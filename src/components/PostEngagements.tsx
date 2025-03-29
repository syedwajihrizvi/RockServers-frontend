import { FaComment, FaHeart } from 'react-icons/fa'
import { IPost } from '../utils/interfaces/Interfaces'

function formatLikes(likes: number) {
    if (likes >= 1000000) {
        return (likes / 1000000).toFixed(1) + "M"; // Millions
    } else if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + "K"; // Thousands
    } else {
        return likes.toString(); // Return as-is for smaller numbers
    }
}

export const PostEngagements = ({post}: {post: IPost}) => {
  return (
        <span className="post-card__engagements">
            <span>
                <FaComment className='icon'/>
                <p>{post?.comments.length}</p>
            </span>
            <span>
                <FaHeart className="icon icon--heart"/>
                <p>{formatLikes(post?.likes as number)}</p>
            </span>
        </span>
  )
}
