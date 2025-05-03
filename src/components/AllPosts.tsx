import { PostsGrid } from './PostsGrid'
import { Filters } from './Filters'
import { Sorters } from './Sorters'

export const AllPosts = ({userId}: {userId?: string | undefined}) => {
  return (
    <div className="main-content">
        <div className="queries">
            <Filters/>
            <Sorters/>
        </div>
        <PostsGrid userId={userId}/>
    </div>
  )
}
