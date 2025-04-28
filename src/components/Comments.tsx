import { useEffect, useRef, useState } from "react"
import { IComment, IUser } from "../utils/interfaces/Interfaces"
import { Comment } from "./Comment"
import { ToastContainer, toast } from 'react-toastify'
import { MdFilterList } from "react-icons/md"
import { useGlobalContext } from "../providers/global-provider"
import { generateProfileImageUrl, userDidLike } from "../utils/helpers/helpers"
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query"
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useNavigate } from "react-router-dom"

export const AddComment = ({customClass, handleAddComment, handleSubmitComment, user, comment, handleSetComment}: 
    {customClass?: string, handleAddComment: () => void, 
    handleSubmitComment: (commentContent: string | undefined, comment: IComment | null) => void, user: IUser | undefined, comment: IComment | null, handleSetComment: () => void}) => {
    const [addingComment, setAddingComment] = useState(comment? true : false)
    const [commentBody, setCommentBody] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { isLoggedIn } = useGlobalContext()
    
    useEffect(() => {
        if (comment)
            setAddingComment(true)
        else
            setAddingComment(false)
    }, [comment])

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
        handleSetComment()
        setAddingComment(false)      
    }

    const handleSubmitClick = () => {
        handleSubmitComment(commentBody, comment)
        if (inputRef && inputRef.current)
            inputRef.current.value = ""
        handleSetComment()
        setAddingComment(false)
    }

    return user && (
        <div className={`card-details-card__comments__add-wrapper ${customClass ? customClass : ''}`}>
            <div className="card-details-card__comments__add">
                <img src={generateProfileImageUrl(user)} alt="Avatar"/>
                <input type="text" placeholder={comment ? `Reply to ${comment.commentedBy}` : "Add Comment..."} 
                    onFocus={(event) => handleSetAddingComment(event.target)}
                    onChange={(event) => setCommentBody(event.target.value)}
                    ref={inputRef}/>
            </div>
            <div className={`button-group add-comment add-comment--${addingComment ?  'shown' : 'hidden'}`}>
                <button className="btn btn--xs btn--success" onClick={() => handleSubmitClick()}>
                    Submit
                </button>
                <button className="btn btn--xs btn--danger" onClick={() => handleCancelClick()}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export const Comments = ({comments, withViewAll, handleAddComment, handleSubmitComment, commentType}: 
    {comments: IComment[], withViewAll: boolean, 
     handleAddComment: () => void, 
     handleSubmitComment: (commentContent: string | undefined, comment: IComment | null) => void,
     commentType: "comments" | "discussionComments"}) => {
    const [viewAll, setViewAll] = useState(false)
    const [replying, setReplying] = useState<IComment | null>(null)
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

    const handleReplyClick = (comment: IComment) => {
        setReplying(comment)
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
            {user && 
            <AddComment handleAddComment={handleAddComment} handleSubmitComment={handleSubmitComment} 
                        user={user} comment={replying} handleSetComment={() => setReplying(null)}/>}
            {comments && 
                renderComments(comments).map(comment => (
                    <Comment key={comment.id} comment={comment} 
                             userLiked={user? userDidLike(user.likedComments, comment.id) : false}
                             handleLike={handleCommentLike} commentType={commentType}
                             handleReplyClick={handleReplyClick}/>
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
                    <Comment key={comment.id} comment={comment} 
                             userLiked={user? userDidLike(commentType == 'comments' ? user.likedComments : user.likedDiscussionComments, comment.id) : false}
                             handleLike={handleCommentLike} commentType={commentType}
                             handleReplyClick={handleReplyClick}/>
                ))}
                </div>
                {user && 
                <AddComment customClass='with-x-padding' handleAddComment={handleAddComment} 
                        handleSubmitComment={handleSubmitComment} 
                        user={user} comment={replying} handleSetComment={() => setReplying(null)}/>}
            </div>
}
