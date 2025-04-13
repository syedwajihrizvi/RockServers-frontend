import { IComment } from "../utils/interfaces/Interfaces"
import Avatar from "../assets/images/avatar.webp"
import { FaHeart, FaRegHeart } from "react-icons/fa"

export const Comment = ({comment, userLiked, handleLike}: 
{comment: IComment, userLiked: boolean, handleLike: (commentId: number | undefined) => void}) => {
  return (
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
            <span>
                {userLiked ? 
                <FaHeart fontSize={12} className="icon" color='red' onClick={() => handleLike(comment.id)}/> : 
                <FaRegHeart fontSize={12} className="icon" color='red' onClick={() => handleLike(comment.id)}/>}
                <p>{comment.likes}</p>
            </span>
        </div>
    </div>
  )
}
