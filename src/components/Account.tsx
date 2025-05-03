import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import JaosonLucia from "../assets/images/rockstart-games-wp.webp"
import FranklinChop from "../assets/images/rockstart-games-wp-2.webp"
import JohnMarston from "../assets/images/rockstart-games-wp-3.webp"
import ArthurMorgan from "../assets/images/rockstart-games-wp-4.webp"
import Trevor from "../assets/images/rockstart-games-wp-5.webp"
import Sadie from "../assets/images/rockstart-games-wp-6.webp"
import Michael from "../assets/images/rockstart-games-wp-7.webp"
import { ReactNode, useEffect, useState, useRef } from "react"
import { Outlet } from "react-router-dom"

interface WallpaperProps {
  location: string,
  class: string,
  alt: string
}

export const Account = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null)

  const images : WallpaperProps[] = [
    {location: JaosonLucia, class: "account-container__img-one", alt: ""},
    {location: FranklinChop, class: "account-container__img-two", alt: ""},
    {location: JohnMarston, class: "account-container__img-two", alt: ""},
    {location: ArthurMorgan, class: "account-container__img-two", alt: ""},
    {location: Trevor, class: "account-container__img-two", alt: ""},
    {location: Sadie, class: "account-container__img-two", alt: ""},
    {location: Michael, class: "account-container__img-two", alt: ""},
  ]

  const imageRefs = useRef<(HTMLImageElement | null)[]>([...new Array(images.length).fill(null)])

  const imageNodes : ReactNode[] = images.map((image, idx) => 
    <img key={idx} ref={(element) => {imageRefs.current[idx] = element}} 
         className={`account-container__img ${image.class}`} 
         src={image.location} alt={image.alt}/>
  )

  useEffect(() => {
    const handleImageChange = setInterval(() => {
      const currentIndex = currentImageIndex
      setCurrentImageIndex(currentImageIndex == images.length - 1 ? 0 : currentImageIndex + 1)
      setPrevImageIndex(currentIndex)
    }, 3000)
    return () => clearInterval(handleImageChange)
  })

  useGSAP(() => {
    const tl = gsap.timeline()
    if (prevImageIndex != null)
      tl.to(imageRefs.current[prevImageIndex], { opacity: 0, duration: 0.8})
    tl.to(imageRefs.current[currentImageIndex], { opacity: 1, duration: 0.8})
  }, [currentImageIndex])

  return (
  <div className="account-container">
    <div>
      {imageNodes}
    </div>
    <div className="account-container__content">
      <Outlet/>
    </div>
  </div>
  )
}
