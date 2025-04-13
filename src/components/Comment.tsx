import { IComment } from "../utils/interfaces/Interfaces"
import Avatar from "../assets/images/avatar.webp"
import { FaHeart, FaRegHeart, FaTrash} from "react-icons/fa"
import { useGlobalContext } from "../providers/global-provider"
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { formatStringDate } from "../utils/helpers/helpers"

export const Comment = ({comment, userLiked, commentType, handleLike}: 
{comment: IComment, userLiked: boolean, commentType: "comments" | "discussionComments", handleLike: (commentId: number | undefined) => void}) => {
 const queryClient = useQueryClient()
 const {id: contentId} = useParams()
 const { user, isLoggedIn } = useGlobalContext()

 const handleDeleteComment = () => {
    apiClient.delete(`/${commentType}/${comment.id}`)
             .then(() => {queryClient.invalidateQueries({queryKey: [commentType, parseInt(contentId as string)]})})
             .catch(err => console.log(err))
 }
 
  return (
    <div className="comment">
        <div className="comment__content">
            <div className="comment__content__user-info">
                <img src={Avatar} alt="Comment User Avatar"/>
            </div>
            <div className="comment__content__content">
                <h5 className="comment__content__content__user">{comment.commentedBy}</h5>
                <p className="comment__content__content__comment">{comment.content}</p>
                <p className="comment__content__content__date">{formatStringDate(comment.commentedAt)}</p>
            </div>
        </div>
        <div className="comment__engagement">
            <span>
                {isLoggedIn && user && comment.appUserId == user.id &&
                <FaTrash fontSize={12} className="icon" color='black' onClick={handleDeleteComment}/>}
                {userLiked ? 
                <FaHeart fontSize={12} className="icon" color='red' onClick={() => handleLike(comment.id)}/> : 
                <FaRegHeart fontSize={12} className="icon" color='red' onClick={() => handleLike(comment.id)}/>}
                <p>{comment.likes}</p>
            </span>
        </div>
    </div>
  )
}
