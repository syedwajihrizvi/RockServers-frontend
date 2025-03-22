import { PostCard } from './PostCard'
import placeholder from "../assets/images/placeholder.webp"

export const Posts = () => {
  return (
    <div className="grid">
        {[...Array(12).keys()].map(() => <PostCard image={placeholder}/>)}
    </div>
  )
}
