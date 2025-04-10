import { useState } from "react"
import { IComment } from "../utils/interfaces/Interfaces"
import { Comment } from "./Comment"
import Avatar from "../assets/images/avatar.webp"
import { MdFilterList } from "react-icons/md"
import { useGlobalContext } from "../providers/global-provider"

export const AddComment = ({customClass, handleAddComment}: 
    {customClass?: string, handleAddComment: () => void}) => {
    const [addingComment, setAddingComment] = useState(false)
    const { isLoggedIn } = useGlobalContext()

    const handleSetAddingComment = (target: HTMLInputElement) => {
        if (!isLoggedIn) {
            handleAddComment()
            target.blur()
        }
        else
            setAddingComment(true)
    }

    return (
        <div className={`card-details-card__comments__add-wrapper ${customClass ? customClass : ''}`}>
            <div className="card-details-card__comments__add">
                <img src={Avatar} alt="Avatar"/>
                <input type="text" placeholder="Add Comment..." 
                    onFocus={(event) => handleSetAddingComment(event.target)}
                    onBlur={() => setAddingComment(false)}
                    />
            </div>
            <div className={`button-group add-comment add-comment--${addingComment ?  'shown' : 'hidden'}`}>
                <button className="btn btn--xs btn--success">Submit</button>
                <button className="btn btn--xs btn--danger" 
                        onClick={() => setAddingComment(false)}>
                            Cancel
                </button>
            </div>
        </div>
    )
}

export const Comments = ({comments, withViewAll, handleAddComment}: 
    {comments: IComment[], withViewAll: boolean, handleAddComment: () => void}) => {
    const [viewAll, setViewAll] = useState(false)
    const renderComments = (comments: IComment[]) => {
        if (withViewAll)
            return comments.length < 2 || viewAll ? comments : comments.slice(0, 2)
        return comments
    }

    return withViewAll ? 
        <div className="card-details-card__comments">
            <h1>{comments ? `${comments.length} Comments` : 'No Comments'}</h1>
            <AddComment handleAddComment={handleAddComment}/>
            {comments && 
                renderComments(comments).map(comment => (
                    <Comment comment={comment}/>
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
                    <Comment comment={comment}/>
                ))}
                </div>
                <AddComment customClass='with-x-padding' handleAddComment={handleAddComment}/>
            </div>
}
