import { IPost, ThumbnailType } from "../utils/interfaces/Interfaces";
import { useNavigate } from "react-router-dom";
import { Engagements } from "./Engagements";
import { formatStringDate, generateProfileImageUrl, generateImageUrl,renderPartialContent, generateVideoUrl } from "../utils/helpers/helpers";
import { toPlatformIcon } from "../utils/helpers/mappers";
import { useGlobalContext } from "../providers/global-provider";

export const PostCard = ({post}: {post: IPost}) => {
  // Check if post has an active session
  const navigate = useNavigate()
  const { user } = useGlobalContext()

  const renderPostCardThumbnail = () =>
    post.thumbnailType == ThumbnailType.Image ?
                          <img className="post-card__img" src={generateImageUrl(post.thumbnailPath)}/> :
                          <video className="post-card__video" autoPlay={true} loop={true} muted={true}>
                              <source src={generateVideoUrl(post.thumbnailPath)} type="video/mp4"/>
                            </video>


  return (
    <div className="post-card__wrapper" onClick={() => navigate(`/posts/${post.id}`)}>
        <div className="post-card__rating post-card__rating--black post-card__rating--md">
            <p>3.7</p>
        </div>
        {post.activeSession && <div className="post-card__active"/>}
        <div className="post-card">
            {renderPostCardThumbnail()}
            <div className="post-card__content">
                <span className="post-card__heading">
                    <h1 className="post-card__heading__title">{post.title}</h1>
                    <Engagements comments={post.comments} likes={post.likes} 
                                 userLiked={user ? user.likedPosts.includes(post.id) : false}/>
                </span>
                <p className="post-card__description">
                  {renderPartialContent(post.description)}
                </p>
                <div className="post-card__footer">
                  <div className="card__user-info">
                    <img className="card__avatar" src={generateProfileImageUrl(post.appUser)} alt="Avatar"/>
                    <p>Posted by <span style={{fontWeight:'bold'}}>{post.appUser.username}</span> {formatStringDate(post.postedAt)}</p>
                  </div>
                  {toPlatformIcon(post.platformName, 16, 'white')}
                </div>
            </div>
        </div>
    </div>
  )
}
