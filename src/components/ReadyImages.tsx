import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { IImage } from "../utils/interfaces/Interfaces"
import { generateReadyImageUrl } from "../utils/helpers/helpers"
import { useGames } from "../hooks/useGames"

export const ReadyImages = (
    {gameId, gameImages, thumbnailSelected, handleCloseIcon, handleImageClick}: 
    {gameId: number | undefined, gameImages: IImage[], thumbnailSelected: string | undefined,
     handleCloseIcon: () => void, handleImageClick: (gameImage: IImage) => void}) => {
    const { data: games } = useGames()
    const getGameTitle = (gameId: number) => {
    if (games) {
      const game = games.find((g) => g.id == gameId)
      return game ? game.title : ""
    }
    return ""
   }
    return (
      <div className="create-choose-image__container">
        <div className="create-choose-image">
        <IoMdCloseCircle className="close-icon" onClick={handleCloseIcon}/>
          {gameId ? <h1>Showing images for {getGameTitle(gameId)}.</h1> : <h1>Please choose a game first to view its images.</h1>}
          <div className="masonry-grid">
            {gameImages.map(gameImage => 
              <div className="masonry-item" key={gameImage.imagePath}>
                {thumbnailSelected === gameImage.imagePath && (
                  <IoMdCheckmarkCircle className="icon" />
                )}
                <img 
                  onClick={() => handleImageClick(gameImage)} 
                  src={generateReadyImageUrl(gameImage.imagePath)}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
}
