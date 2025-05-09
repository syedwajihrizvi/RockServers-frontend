import { generateVideoUrl } from "../utils/helpers/helpers"
import Placeholder from "../assets/images/placeholder.webp"

export const VideoViaUrl = (
    {customClass, backupClass, url, muted, controls, handleClick}: {backupClass: string, customClass?: string, url?: string, muted: boolean, controls: boolean, handleClick?:() => void}) => {
  return (
        <video className={customClass ? customClass: ''} 
               autoPlay={true} loop={true} muted={muted} controls={controls} onClick={handleClick}
               onError={(e) => {
                const video = e.currentTarget;
                video.style.display = "none";
                const fallback = document.createElement("img");
                fallback.src = Placeholder;
                fallback.className = backupClass;
                video.parentElement?.replaceChild(fallback, video);;
              }}>
            <source src={generateVideoUrl(url as string)} type="video/mp4"/>
        </video>    
  )
}
