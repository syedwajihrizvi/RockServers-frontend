import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { IImage } from "../utils/interfaces/Interfaces"
import { generateReadyImageUrl } from "../utils/helpers/helpers"

export const ReadyImages = (
    {gameId, gameImages, thumbnailSelected, handleCloseIcon, handleImageClick, getGameTitle}: 
    {gameId: number | undefined, gameImages: IImage[], thumbnailSelected: string | undefined,
     handleCloseIcon: () => void, handleImageClick: (gameImage: IImage) => void,
     getGameTitle: (gameId: number) => string}) => {
    return (
      <div className="create-choose-image">
        <IoMdCloseCircle className="close-icon" onClick={handleCloseIcon}/>
        {gameId ? <h1>Showing images for {getGameTitle(gameId)}.</h1> : <h1>Please choose a game first to view its images.</h1>}
        <div className="create-choose-image__img">
          {gameImages.map(gameImage => 
            <div className="create-img__container">
              {thumbnailSelected && 
              thumbnailSelected == gameImage.imagePath && <IoMdCheckmarkCircle className="icon"/>}
              <img onClick={() => handleImageClick(gameImage)} 
                  src={generateReadyImageUrl(gameImage.imagePath)}/>
            </div>)}
        </div>
      </div>
    )
}
