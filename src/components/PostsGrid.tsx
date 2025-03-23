import { PostCard } from './PostCard'
import placeholder from "../assets/images/placeholder.webp"
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'

export const PostsGrid = () => {
  const {data: posts, isLoading} = usePosts()
  
  return (
    <div className="grid">
        {isLoading && 
        [...Array(12).keys()].map(() => <Skeleton/>)}
        {!isLoading && posts!.map((post) => <PostCard image={placeholder} post={post}/>)}
    </div>
  )
}
