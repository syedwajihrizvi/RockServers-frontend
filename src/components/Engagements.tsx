import { FaComment, FaHeart } from 'react-icons/fa'
import { IComment } from '../utils/interfaces/Interfaces';

function formatLikes(likes: number) {
    if (likes >= 1000000) {
        return (likes / 1000000).toFixed(1) + "M"; // Millions
    } else if (likes >= 1000) {
        return (likes / 1000).toFixed(1) + "K"; // Thousands
    } else {
        return likes.toString(); // Return as-is for smaller numbers
    }
}

export const Engagements = ({comments, likes}: {comments: IComment[], likes: number}) => {
  return (
        <span className="post-card__engagements">
            <span>
                <FaComment className='icon'/>
                <p>{comments ? comments.length : 0}</p>
            </span>
            <span>
                <FaHeart className="icon icon--heart"/>
                <p>{formatLikes(likes as number)}</p>
            </span>
        </span>
  )
}
