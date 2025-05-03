import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'

export const PostsGrid = ({userId}: {userId: string | undefined}) => {
  const {data: posts, isLoading: isLoadingPosts} = usePosts({userId})
  const {data: discussions, isLoading: isLoadingDiscussions} = useDiscussions({userId})

  const {gameName, postType} = useQueryStore()
  const renderPosts = () => {
    if (isLoadingPosts || isLoadingDiscussions) {
      return [...Array(12).keys()].map((key) => <Skeleton key={key} customClass='skeleton--md'/>)
    } 
    else if (!isLoadingPosts && (postType == "posts")) {
      return posts!.map((post) => <PostCard key={post.id} post={post}/>)
    }
    else if (!isLoadingDiscussions && (postType == "discussions")) {
      return discussions!.map((discussion) => <DiscussionCard key={discussion.id} discussion={discussion}/>)
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
