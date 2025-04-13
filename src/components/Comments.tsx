import { useRef, useState } from "react"
import { IComment } from "../utils/interfaces/Interfaces"
import { Comment } from "./Comment"
import { ToastContainer, toast } from 'react-toastify'
import Avatar from "../assets/images/avatar.webp"
import { MdFilterList } from "react-icons/md"
import { useGlobalContext } from "../providers/global-provider"
import { userDidLike } from "../utils/helpers/helpers"
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query"
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useNavigate } from "react-router-dom"

export const AddComment = ({customClass, handleAddComment, handleSubmitComment}: 
    {customClass?: string, handleAddComment: () => void, 
    handleSubmitComment: (commentContent: string | undefined) => void}) => {
    const [addingComment, setAddingComment] = useState(false)
    const [commentBody, setCommentBody] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { isLoggedIn } = useGlobalContext()

    const handleSetAddingComment = (target: HTMLInputElement) => {
        if (!isLoggedIn) {
            handleAddComment()
            target.blur()
        }
        else
            setAddingComment(true)
    }

    const handleCancelClick = () => {
        if (inputRef && inputRef.current)
            inputRef.current.value = ""
        setAddingComment(false)      
    }

    const handleSubmitClick = () => {
        handleSubmitComment(commentBody)
        if (inputRef && inputRef.current)
            inputRef.current.value = ""
        setAddingComment(false)
    }

    return (
        <div className={`card-details-card__comments__add-wrapper ${customClass ? customClass : ''}`}>
            <div className="card-details-card__comments__add">
                <img src={Avatar} alt="Avatar"/>
                <input type="text" placeholder="Add Comment..." 
                    onFocus={(event) => handleSetAddingComment(event.target)}
                    onChange={(event) => setCommentBody(event.target.value)}
                    ref={inputRef}/>
            </div>
            <div className={`button-group add-comment add-comment--${addingComment ?  'shown' : 'hidden'}`}>
                <button className="btn btn--xs btn--success" 
                        onClick={() => handleSubmitClick()}>Submit</button>
                <button className="btn btn--xs btn--danger" 
                        onClick={() => handleCancelClick()}>
                            Cancel
                </button>
            </div>
        </div>
    )
}

export const Comments = ({comments, withViewAll, handleAddComment, handleSubmitComment, commentType}: 
    {comments: IComment[], withViewAll: boolean, 
     handleAddComment: () => void, 
     handleSubmitComment: (commentContent: string | undefined) => void,
     commentType: "comments" | "discussionComments"}) => {
    const [viewAll, setViewAll] = useState(false)
    const { user, isLoggedIn } = useGlobalContext()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const renderComments = (comments: IComment[]) => {
        if (withViewAll)
            return comments.length < 2 || viewAll ? comments : comments.slice(0, 2)
        return comments
    }

    const handleToastButtonClick = () => {
        navigate('/account/login')
    }

    const handleCommentLike = (commentId: number | undefined) => {
        if (isLoggedIn) {
            apiClient.patch(`/${commentType}/${commentId}/updateLikes`, !(user && commentId && userDidLike(commentType == 'comments' ? user.likedComments : user.likedDiscussionComments, commentId)), {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`
                }
              }).then(() => {
                queryClient.invalidateQueries({queryKey: ["me"]})
                queryClient.invalidateQueries({queryKey: [commentType]})
              })
        } else {
            toast(LoginToastComponent({action: "Like this Post", handleClick: handleToastButtonClick}), {autoClose: 5000})
        }
    }

    return withViewAll ? 
        <div className="card-details-card__comments">
                    <ToastContainer
            position="top-center"
            />
            <h1>{comments ? `${comments.length} Comments` : 'No Comments'}</h1>
            <AddComment handleAddComment={handleAddComment} handleSubmitComment={handleSubmitComment}/>
            {comments && 
                renderComments(comments).map(comment => (
                    <Comment comment={comment} 
                             userLiked={user? userDidLike(user.likedComments, comment.id) : false}
                             handleLike={handleCommentLike} commentType={commentType}/>
            ))}
            {comments && comments.length > 2 && 
                <div className="comment__view-all">
                    <p>{viewAll ? "Back" : "View All"}</p>
                    <MdFilterList className="icon" fontSize={20} onClick={() => setViewAll(!viewAll)}/>
                </div>}          
            </div> : 
            <div className="card-details-fixed__comments">
                <div className="card-details-fixed__comments__content">
                <h1>{comments.length > 0 ? `${comments.length} Comments` : 'No Comments'}</h1>
                {renderComments(comments).map(comment => (
                    <Comment comment={comment} 
                             userLiked={user? userDidLike(commentType == 'comments' ? user.likedComments : user.likedDiscussionComments, comment.id) : false}
                             handleLike={handleCommentLike} commentType={commentType}/>
                ))}
                </div>
                <AddComment customClass='with-x-padding' handleAddComment={handleAddComment} 
                            handleSubmitComment={handleSubmitComment}/>
            </div>
}
