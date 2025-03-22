import { FaComment, FaThumbsUp } from "react-icons/fa";

export const PostCard = ({image}: {image: string}) => {
  return (
    <div className="post-card__wrapper">
        <div className="post-card__rating">
            <p>3.7</p>
        </div>
        <span className="post-card__active">
            <p>active</p>
        </span>
        <div className="post-card">
            <img className="post-card__img" src={image}/>
            <div className="post-card__content">
                <span className="post-card__heading">
                    <h1 className="post-card__heading__title">Title</h1>
                    <h1 className="post-card__date">2 hours ago</h1>
                </span>
                <span className="post-card__info">
                    <h1 className="post-card__poster">Name</h1>
                    <span className="post-card__engagements">
                        <span className="post-card__comments">
                            <p>23 <FaComment className="icon"/></p>
                        </span>
                        <span className="post-card__likes">
                            <p>1.7k <FaThumbsUp className="icon"/></p>
                        </span>
                    </span>
                </span>
                <p className="post-card__description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Alias nesciunt illum quibusdam quae delectus odio quasi 
                    mollitia minus iusto ipsum?
                </p>
            </div>
        </div>
    </div>
  )
}
