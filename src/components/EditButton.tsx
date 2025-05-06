import { useNavigate } from "react-router-dom"

export const EditButton = ({type, contentId}: {type : 'discussions' | 'posts', contentId: number}) => {
  const navigate = useNavigate()
  return (
    <>
    <button className="btn btn--success btn--sm btn--delete" 
            onClick={() => navigate(`/edit/${type}/${contentId}`)}>
        Edit {type == 'posts' ? 'Post' : 'Discussion' }
    </button>
    </>
  )
}
