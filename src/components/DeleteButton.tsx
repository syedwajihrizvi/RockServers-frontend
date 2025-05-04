import { ToastContainer, toast } from "react-toastify"
import { deleteDiscussion, deletePost } from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export const DeleteButton = ({type, contentId}: {type: "discussion" | "post", contentId: number}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const deleteContent = () => 
    toast.promise(
        type == "discussion" ? 
        deleteDiscussion(contentId) : 
        deletePost(contentId),
        {
            pending: `Deleting ${type}...`,
            success: "Successfully deleted!",
            error: "An unexpected error occured"
        }
    ).then(() => {
        queryClient.invalidateQueries({queryKey: ["me"]})
        navigate('/')
    })

  return (
    <>
        <ToastContainer position="top-center"/>
        <button className="btn btn--danger btn--md btn--delete" onClick={deleteContent}>
            Delete your {type == "discussion" ? "Discussion" : "Post"}
        </button>
    </>
  )
}
