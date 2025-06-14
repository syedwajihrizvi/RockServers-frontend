import { FaComment, FaHeart, FaRegHeart, FaEye  } from 'react-icons/fa'
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

export const Engagements = ({comments, likes, userLiked, views, handleLike}: 
    {comments: IComment[] | undefined, likes: number, views: number, userLiked: boolean, handleLike?: () => void}) => {
  
  const commentCount = Array.isArray(comments) ? comments && comments.length : typeof comments == 'number' ? comments : 0;

  return (
        <span className="post-card__engagements">
            <span>
                <FaEye className='icon'/>
                <p>{views}</p>
            </span>
            <span>
                {userLiked ? 
                <FaHeart className="icon icon--heart" onClick={handleLike}/> : 
                <FaRegHeart className="icon icon--heart" onClick={handleLike}/>}
                <p>{formatLikes(likes as number)}</p>
            </span>
            <span>
                <FaComment className='icon'/>
                <p>{commentCount}</p>
            </span>
        </span>
  )
}
