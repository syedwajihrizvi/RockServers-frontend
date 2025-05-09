import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'

export const PostsGrid = ({userId}: {userId: string | undefined}) => {
  const {data: posts, isLoading: isLoadingPosts} = usePosts({userId})
  const {data: discussions, isLoading: isLoadingDiscussions} = useDiscussions({userId})
  const { orderBy } = useQueryStore()

  const {gameName, postType, platformName} = useQueryStore()
  const renderPosts = () => {
    console.log(orderBy)
    if (isLoadingPosts || isLoadingDiscussions) {
      return [...Array(12).keys()].map((key) => <Skeleton key={key} customClass='skeleton--md'/>)
    } 
    else if (!isLoadingPosts && (postType == "posts")) {
      const mappedPosts = (!orderBy || orderBy != "default") ? posts : [...posts!].sort(() => Math.random() - 0.5)
      return mappedPosts!.map((post) => <PostCard key={post.id} post={post}/>)
    }
    else if (!isLoadingDiscussions && (postType == "discussions")) {
      const mappedDiscussion = (!orderBy || orderBy != "default") ? discussions : [...discussions!].sort(() => Math.random() - 0.5)
      return mappedDiscussion!.map((discussion) => <DiscussionCard key={discussion.id} discussion={discussion}/>)
    } else {
      // Render an assorted version of all posts
      console.log("Invalid post type")
    }
  }

  return (
    <div className='posts-grid'>
      {gameName && postType == 'posts' && 
      <h1 className='post-grid__title'>Sessions for {gameName ? ` for ${gameName}` : ""} {platformName ? ` on ${platformName}.` : '.'}</h1>}
      {gameName && postType == 'discussions' && 
      <h1 className='post-grid__title'>Discussions for {gameName ? ` for ${gameName}.` : "."}</h1>}
      {postType == 'posts' && posts?.length == 0 && 
      <h1 className='post-grid__no-results'>No Sessions found{gameName ? ` for ${gameName}` : ""} {platformName ? ` on ${platformName}.` : '.'}</h1>}
      {postType == 'discussions' && discussions?.length == 0 && 
      <h1 className='post-grid__no-results'>No Discussions found{gameName ? ` for ${gameName}.` : "."}</h1>}
      <div className="grid">
          {renderPosts()}
      </div>
    </div>
  )
}
