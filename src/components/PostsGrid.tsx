import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'
import { useEffect, useMemo, useRef } from 'react'
import { IDiscussion, IPost } from '../utils/interfaces/Interfaces'
import { Spinner } from 'react-activity'

export const PostsGrid = ({userId}: {userId: string | undefined}) => {
  const {data: posts, isLoading: isLoadingPosts, fetchNextPage: fetchNextPosts, hasNextPage: hasNextPosts} = usePosts({userId})
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const {data: discussions, isLoading: isLoadingDiscussions, fetchNextPage: fetchNextDiscussions, hasNextPage: hasNextDiscussions} = useDiscussions({userId})
  const {gameName, postType, platformName} = useQueryStore()

  const flattenPosts = useMemo(() => {
    if (!posts) return []
    const fetchedPosts : IPost[] = []
    posts.pages.map((page) => {
      page.data.map(post => fetchedPosts.push(post))
    })
    return fetchedPosts
  }, [posts])

  const flattenDiscussions = useMemo(() => {
    if (!discussions) return []
    const fetchedDiscussions : IDiscussion[] = []
    discussions.pages.map((page) => {
      page.data.map(discussion => fetchedDiscussions.push(discussion))
    })
    return fetchedDiscussions
  }, [discussions])


  const renderPosts = () => {
    if (!isLoadingPosts && (postType == "posts")) {
      return flattenPosts?.map((post: IPost) => <PostCard key={post.id} post={post}/>)
    }
    else if (!isLoadingDiscussions && (postType == "discussions")) {
      return flattenDiscussions?.map((discussion: IDiscussion) => <DiscussionCard key={discussion.id} discussion={discussion}/>)
    }
    if (isLoadingPosts || isLoadingDiscussions || !posts || !discussions) {
      return [...Array(12).keys()].map((key) => <Skeleton key={key} customClass='skeleton--md'/>)
    } 
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Need to determine if the spinner is in the view
      const entry = entries[0]
      if (entry.isIntersecting) {
        if (postType == 'posts' && hasNextPosts)
          fetchNextPosts()
        else if (postType == 'discussions' && hasNextDiscussions)
          fetchNextDiscussions()
      }
    })
  
    const current = loaderRef.current
    if (current)
      observer.observe(current)
    return () => {
      if (current)
        observer.unobserve(current)
    }
  }, [postType, hasNextPosts, hasNextDiscussions, fetchNextDiscussions, fetchNextPosts])

  return (
    <div className='posts-grid'>
      {gameName && postType == 'posts' && 
      <h1 className='post-grid__title'>Sessions for {gameName ? ` for ${gameName}` : ""} {platformName ? ` on ${platformName}.` : '.'}</h1>}
      {gameName && postType == 'discussions' && 
      <h1 className='post-grid__title'>Discussions for {gameName ? ` for ${gameName}.` : "."}</h1>}
      {postType == 'posts' && !isLoadingPosts && flattenPosts?.length == 0 && 
      <h1 className='post-grid__no-results'>No Sessions found{gameName ? ` for ${gameName}` : ""} {platformName ? ` on ${platformName}.` : '.'}</h1>}
      {postType == 'discussions' && !isLoadingDiscussions && flattenDiscussions?.length == 0 && 
      <h1 className='post-grid__no-results'>No Discussions found{gameName ? ` for ${gameName}.` : "."}</h1>}
      <div className="grid">
          {renderPosts()}
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5rem'}} ref={loaderRef}>
        {postType == "posts" && isLoadingPosts &&  <Spinner color="white"/>}
        {postType == "posts" && isLoadingPosts &&  <Spinner color="white"/>}
      </div>
    </div>
  )
}
