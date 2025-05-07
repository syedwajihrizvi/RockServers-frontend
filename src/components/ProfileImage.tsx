import { generateProfileImageUrl } from "../utils/helpers/helpers";
import { IUser } from "../utils/interfaces/Interfaces";
import Avatar from "../assets/images/no-profile.jpg"

export const ProfileImage = ({customClass, user}: {customClass?: string, user: IUser}) => {
  return (
    <img className={customClass ? customClass : ''} 
    src={generateProfileImageUrl(user)} alt="Avatar"
    onError={(e) => {
       e.currentTarget.onerror = null; // prevent infinite loop
       e.currentTarget.src = Avatar;
     }}
    />
  )
}
