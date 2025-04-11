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

export const Engagements = ({comments, likes, handleLike}: 
    {comments: IComment[] | number, likes: number, handleLike: () => void}) => {
  
  const commentCount = Array.isArray(comments) ? comments && comments.length : typeof comments == 'number' ? comments : 0;

  return (
        <span className="post-card__engagements">
            <span>
                <FaComment className='icon'/>
                <p>{commentCount}</p>
            </span>
            <span>
                <FaHeart className="icon icon--heart" onClick={handleLike}/>
                <p>{formatLikes(likes as number)}</p>
            </span>
        </span>
  )
}
