import { useState } from "react"
import { IComment } from "../utils/interfaces/Interfaces"
import { Comment } from "./Comment"
import Avatar from "../assets/images/avatar.webp"
import { MdFilterList } from "react-icons/md"

export const Comments = ({comments, addFirst}: {comments: IComment[], addFirst: boolean}) => {
    const [viewAll, setViewAll] = useState(false)
    const [addingComment, setAddingComment] = useState(false)
    const renderComments = (comments: IComment[]) =>
        comments.length < 2 || viewAll ? comments : comments.slice(0, 2)

    const renderAddComment = () => {
        return (
            <div className="card-details-card__comments__add-wrapper">
                <div className="card-details-card__comments__add">
                    <img src={Avatar} alt="Avatar"/>
                    <input type="text" placeholder="Add Comment..." 
                        onFocus={() => setAddingComment(true)}
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

    return (
        <div className="card-details-card__comments">
            <h1>{comments ? `${comments.length} Comments` : 'No Comments'}</h1>
            {addFirst && 
            <>
                {renderAddComment()}
                {comments && 
                renderComments(comments).map(comment => (
                    <Comment comment={comment}/>
                ))}
                {comments && comments.length > 2 && 
                <div className="comment__view-all">
                    <p>View All</p>
                    <MdFilterList className="icon" fontSize={20} onClick={() => setViewAll(!viewAll)}/>
                </div>}          
            </>}
            {!addFirst && 
            <>
                {comments && 
                renderComments(comments).map(comment => (
                    <Comment comment={comment}/>
                ))}
                {renderAddComment()}
            </>}
        </div>
    )
}
