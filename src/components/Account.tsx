import WallPaperOne from "../assets/images/rockstart-games-wp.png"
import WallPaperTwo from "../assets/images/rockstart-games-wp-2.png"
import WallPaperThree from "../assets/images/rockstart-games-wp-3.png"
import WallPaperFour from "../assets/images/rockstart-games-wp-4.png"
import WallPaperFive from "../assets/images/rockstart-games-wp-5.png"
import WallPaperSix from "../assets/images/rockstart-games-wp-6.png"
import WallPaperSeven from "../assets/images/rockstart-games-wp-7.png"
import { ReactNode, useEffect, useState } from "react"

export const Account = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images : ReactNode[] = [
    <img className="account-container__img account-container__img-one" src={WallPaperOne} alt="Niko, Max Payne, JM"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperTwo} alt="Franklin and Chop"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperThree} alt="John Marston"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperFour} alt="Arthur Morgan"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperFive} alt="Arthur Morgan"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperSix} alt="Arthur Morgan"/>,
    <img className="account-container__img account-container__img-two" src={WallPaperSeven} alt="Arthur Morgan"/>
  ]

  useEffect(() => {
    const handleClick = () => {
      setCurrentImageIndex(currentImageIndex == images.length - 1 ? 0 : currentImageIndex + 1)
    }
    window.addEventListener('click', handleClick)

    return () => window.removeEventListener('click', handleClick)
  })

  return (
    <div className="account-container">
      <div>
        {images[currentImageIndex]}
      </div>
    </div>
  )
}
