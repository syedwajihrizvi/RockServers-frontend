import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'

export const PostsGrid = () => {
  const {data: posts, isLoading: isLoadingPosts} = usePosts()
  const {data: discussions, isLoading: isLoadingDiscussions} = useDiscussions()

  const {gameName} = useQueryStore()
  return (
    <div className='posts-grid'>
      {gameName && <h1 className='post-grid__title'>Posts for {gameName}</h1>}
      <div className="grid">
          {(isLoadingPosts || isLoadingDiscussions) && 
          [...Array(12).keys()].map(() => <Skeleton customClass='skeleton--md'/>)}
          {!isLoadingPosts && posts!.map((post) => <PostCard post={post}/>)}
          {!isLoadingDiscussions && discussions!.map((discussion) => <DiscussionCard discussion={discussion}/>)}
      </div>
    </div>
  )
}
