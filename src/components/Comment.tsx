import { IComment } from "../utils/interfaces/Interfaces"
import Avatar from "../assets/images/avatar.webp"
import { FaHeart, FaThumbsDown } from "react-icons/fa"

export const Comment = ({comment}: {comment: IComment}) => {
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
            <span><FaHeart fontSize={12} className="icon" color='red'/><p>{comment.likes}</p></span>
            <span><FaThumbsDown fontSize={12} className="icon"/></span>
        </div>
    </div>
  )
}
