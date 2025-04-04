import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'

export const PostsGrid = () => {
  const {data: posts, isLoading: isLoadingPosts} = usePosts()
  const {data: discussions, isLoading: isLoadingDiscussions} = useDiscussions()

  const {gameName, postType} = useQueryStore()
  const renderPosts = () => {
    if (isLoadingPosts || isLoadingDiscussions) {
      return [...Array(12).keys()].map(() => <Skeleton customClass='skeleton--md'/>)
    } 
    else if (!isLoadingPosts && (postType == "posts")) {
      return posts!.map((post) => <PostCard post={post}/>)
    }
    else if (!isLoadingDiscussions && (postType == "discussions")) {
      return discussions!.map((discussion) => <DiscussionCard discussion={discussion}/>)
    } else {
      // Render an assorted version of all posts
      console.log("Invalid post type")
    }
  }

  return (
    <div className='posts-grid'>
      {gameName && <h1 className='post-grid__title'>Posts for {gameName}</h1>}
      <div className="grid">
          {renderPosts()}
      </div>
    </div>
  )
}
