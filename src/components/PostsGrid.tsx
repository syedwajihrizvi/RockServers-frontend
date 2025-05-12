import { PostCard } from './PostCard'
import { usePosts }  from '../hooks/usePosts'
import { Skeleton } from './Skeleton'
import useQueryStore from '../stores/useQueryStore'
import { useDiscussions } from '../hooks/useDiscussions'
import { DiscussionCard } from './DiscussionCard'
import { shuffleArray } from '../utils/helpers/helpers'
import { useMemo, useState } from 'react'
import { IoRefreshCircle } from "react-icons/io5";
import { useQueryClient } from '@tanstack/react-query'

export const PostsGrid = ({userId}: {userId: string | undefined}) => {
  const {data: posts, isLoading: isLoadingPosts} = usePosts({userId})
  const {data: discussions, isLoading: isLoadingDiscussions} = useDiscussions({userId})
  const [shuffleKey, setShuffleKey] = useState(0)
  const { orderBy } = useQueryStore()
  const queryClient = useQueryClient()
  const {gameName, postType, platformName} = useQueryStore()

  const shuffledPosts = useMemo(() => {
    if (!posts) return [];
    return (orderBy && orderBy !== "default") ? posts : shuffleArray(posts);
  }, [posts, orderBy, shuffleKey]);
  
  const shuffledDiscussions = useMemo(() => {
    if (!discussions) return [];
    return (orderBy && orderBy !== "default") ? discussions : shuffleArray(discussions);
  }, [discussions, orderBy, shuffleKey]);

  const renderPosts = () => {
    if (!isLoadingPosts && (postType == "posts")) {
      return shuffledPosts!.map((post) => <PostCard key={post.id} post={post}/>)
    }
    else if (!isLoadingDiscussions && (postType == "discussions")) {
      return shuffledDiscussions!.map((discussion) => <DiscussionCard key={discussion.id} discussion={discussion}/>)
    }
    if (isLoadingPosts || isLoadingDiscussions || !posts || !discussions) {
      return [...Array(12).keys()].map((key) => <Skeleton key={key} customClass='skeleton--md'/>)
    } 
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['posts'], refetchType: 'active'})
    queryClient.invalidateQueries({queryKey: ['discussions'], refetchType: 'active'})
    setShuffleKey((prev) => prev + 1)
  }

  return (
    <div className='posts-grid'>
      <IoRefreshCircle className='icon--refresh' onClick={handleRefresh}/>
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
