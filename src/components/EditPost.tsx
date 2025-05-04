import { useParams } from "react-router-dom"
import { PostData } from "../utils/interfaces/Interfaces"
import { useState } from "react"

export const EditPost = () => {
  const { id: postId } = useParams()
  const [postData, setPostData] = useState<PostData>({})

  return (
    <div className="create-container--wrapper">
        EditPost {postId}
    </div>
  )
}
