import Placeholder from "../assets/images/placeholder.webp"
import { generateImageUrl } from "../utils/helpers/helpers";

export const ImageViaUrl = ({customClass, src, handleClick}: {customClass?: string, src: string, handleClick?: () => void}) => {
  return (
        <img className={customClass ? customClass : ''}
             onClick={handleClick}
             src={generateImageUrl(src)}
             onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                e.currentTarget.src = Placeholder;
        }}/>
  )
}
