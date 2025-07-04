import { IComment, IReply } from "../utils/interfaces/Interfaces"
import { FaHeart, FaRegHeart, FaTrash} from "react-icons/fa"
import { useGlobalContext } from "../providers/global-provider"
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { formatStringDate } from "../utils/helpers/helpers"
import { useState } from "react"
import { ProfileImage } from "./ProfileImage"

export const Comment = ({comment, userLiked, commentType, handleLike, handleReplyClick}: 
{comment: IComment, userLiked: boolean, commentType: "comments" | "discussionComments", 
    handleLike: (commentId: number | undefined) => void, handleReplyClick: (comment: IComment) => void}) => {
 const queryClient = useQueryClient()
 const {id: contentId} = useParams()
 const [viewReplies, setViewReplies] = useState(false)
 const { isLoading, user, isLoggedIn } = useGlobalContext()

 const handleDeleteComment = () => {
    apiClient.delete(`/${commentType}/${comment.id}`)
             .then(() => {queryClient.invalidateQueries({queryKey: [commentType, parseInt(contentId as string)]})})
             .catch(err => console.log(err))
 }
 
 const renderViewReplies = () =>
    !viewReplies ? 
                <p className="view-replies" onClick={() => setViewReplies(true)}>View {comment.replies.length} replies</p> : 
                <p className="view-replies" onClick={() => setViewReplies(false)}>Hide Replies</p>

  const renderReplies = (replies: IReply[]) =>
  {
    const handleReplyLike = (replyId: number) => {
        apiClient.patch(
            `/${commentType}/${comment.id}/${replyId}/updateLikes`, 
            null, 
            {headers: {'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`}})
            .then(() => {
                queryClient.invalidateQueries({queryKey: ["me"]})
                queryClient.invalidateQueries({queryKey: [commentType]})    
            })
            .catch(err => console.log(err))
    }

    const handleDeleteReply = (replyId: number) => {
        apiClient.delete(
            `/${commentType}/${comment.id}/${replyId}`, 
            {headers: {'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`}})
            .then(() => {
                queryClient.invalidateQueries({queryKey: ["me"]})
                queryClient.invalidateQueries({queryKey: [commentType]})    
            })
            .catch(err => console.log(err))
    }

    const userLikedReply = (replyId: number): boolean => {
        if (commentType == "comments") {
            if (user && user.likedPostReplys)
                return user.likedPostReplys.includes(replyId)
            return false;        
        } else {
            if (user && user.likedDiscussionReplys)
                return user.likedDiscussionReplys.includes(replyId)
            return false
        }
    }
        
    return (
        <div className="replies">
        {replies.map(reply => 
            <div className="reply__wrapper">
                <div className="reply">
                    <ProfileImage customClass="reply__avatar" user={reply.appUser}/>
                    <div className="reply__body">
                        <h3 className="comment__content__content__user">{reply.appUser.username}</h3>
                        <p className="comment__content__content__comment">{reply.content}</p>
                        <p className="comment__content__content__date">{formatStringDate(reply.repliedAt)}</p>
                    </div>
                </div>
                <div className="comment__engagement">
                <span>
                    {isLoggedIn && user && reply.appUser.id == user.id &&
                    <FaTrash fontSize={12} className="icon" color='black' onClick={() => handleDeleteReply(reply.id)}/>}
                    {userLikedReply(reply.id) ? 
                    <FaHeart fontSize={12} className="icon" color='red' onClick={() => handleReplyLike(reply.id)}/> : 
                    <FaRegHeart fontSize={12} className="icon" color='red' onClick={() => handleReplyLike(reply.id)}/>}
                    <p>{reply.likes}</p>
                </span>
        </div>
            </div>)}
    </div>
    )
  }

  return !isLoading && (
    <div className="comment">
        <div className="comment__content">
            <div className="comment__content__user-info">
                <ProfileImage customClass="card__avatar" user={comment.appUser}/>
            </div>
            <div className="comment__content__content">
                <h5 className="comment__content__content__user">{comment.commentedBy}</h5>
                <p className="comment__content__content__comment">{comment.content}</p>
                <span className="comment__content__content__actions">
                    <p className="comment__content__content__date">{formatStringDate(comment.commentedAt)}</p>
                    <p className="comment__content__content__reply" onClick={() => handleReplyClick(comment)}>Reply</p>
                </span>
                {comment.replies && comment.replies.length > 0 && renderViewReplies()}
                {viewReplies && renderReplies(comment.replies)}
            </div>
        </div>
        <div className="comment__engagement">
            <span>
                {isLoggedIn && user && comment.appUser.id == user.id &&
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
