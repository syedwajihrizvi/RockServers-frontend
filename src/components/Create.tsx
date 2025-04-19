import { FaUpload } from "react-icons/fa6"
import { IoMdCloseCircle, IoMdCheckmarkCircle } from "react-icons/io";
import { FaTrash } from "react-icons/fa"
import { IoCloseCircle } from "react-icons/io5"
import { useEffect, useState } from "react"
import { useGames } from "../hooks/useGames";
import { IImage } from "../utils/interfaces/Interfaces";
import apiClient from "../utils/services/dataServices"
import { generateImageUrl } from "../utils/helpers/helpers";

interface PostData {
  title?: string,
  content?: string,
  gameId?: number,
  imageSelected?: string
}

export const Create = () => {
  const [creatingPost, setCreatingPost] = useState(true)
  const [choosingImage, setChoosingImage] = useState(false)
  const [postData, setPostData] = useState<PostData>({})
  const [gameImages, setGameImages] = useState<IImage[]>([])
  const { data: games, isLoading: isLoadingGames } = useGames()
  

  useEffect(() => {
    if (postData.gameId) {
      apiClient.get(`/images?gameId=${postData.gameId}`)
      .then(res => setGameImages([...res.data]))
      .catch(() => console.log("An Error occured"))
    }
  }, [postData.gameId])

  return (
    <div className="create-container--wrapper">
      {choosingImage && <div className="create-choose-image">
        <IoMdCloseCircle className="close-icon" onClick={() => setChoosingImage(false)}/>
        <h1>Showing images for Game.</h1>
        <div className="create-choose-image__img">
          {gameImages.map(gameImage => 
            <div className="create-img__container">
              {postData && postData.imageSelected && 
              postData.imageSelected == gameImage.imagePath && <IoMdCheckmarkCircle className="icon"/>}
              <img onClick={() => setPostData({...postData, imageSelected: !postData ? gameImage.imagePath : postData.imageSelected == gameImage.imagePath ? undefined :  gameImage.imagePath})} 
                   src={generateImageUrl(gameImage.imagePath)}/>
            </div>)}
        </div>
      </div>}
      <div className="create-container" style={{opacity: choosingImage ? 0.6 : 1}}>
          <div className="create-type">
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(true)}>Post a session</button>
              <button className="btn btn--success btn--md" onClick={() => setCreatingPost(false)}>Discuss Something</button>
          </div>
          {creatingPost && !isLoadingGames && games && <div className="create-post">
            <div className="create-type">
              <select className="create-option" 
                      onChange={(event) => setPostData({...postData, gameId: parseInt(event.target.value)})}>
                <option>Choose a Game</option>
                {games.map(game => 
                  <option key={game.id} value={game.id}>{game.title}</option>)}
              </select>
              <select className="create-option">
                <option>What Platform</option>
                <option>Playstation</option>
                <option>XBox</option>
                <option>PC</option>
              </select>
            </div>
            <input placeholder="Enter a Title" className="create-input"/>
            <textarea placeholder="Enter a description" className="create-textarea"></textarea>
            <div className="create-upload-type">
              <label className="file-upload-wrapper btn btn--success btn--md">
                Upload Image <FaUpload className="icon"/>
                <input type="file"/>
              </label>
              <button className="btn btn--success btn--sm" onClick={() => setChoosingImage(true)}>Choose Ready Image</button>
            </div>
            <div className="create-post__img--selected">
              {postData && postData.imageSelected && 
              <div className="create-post__img--selected__wrapper">
                <img src={generateImageUrl(postData.imageSelected)} onClick={() => setChoosingImage(true)}/>
              </div>}
            </div>
          </div>}
          {!creatingPost && <div className="create-discussion">
            <h1>Create Discussion</h1>
          </div>}
    </div>
    </div>
  )
}
