import { RiUserUnfollowFill } from "react-icons/ri";
import { TiUserAdd } from "react-icons/ti";
import { ToastContainer, toast } from 'react-toastify'
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../providers/global-provider";
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query";
import { IUser } from '../utils/interfaces/Interfaces';
import { ProfileImage } from "./ProfileImage";

export const FollowButton = ({user, removeImage}: 
  {user: IUser, removeImage?: boolean}) => {
  const navigate = useNavigate()
  const { isLoggedIn, user: loggedInUser } = useGlobalContext()
  const queryClient = useQueryClient()
  const handleToastButtonClick = () => {
    navigate('/account/login')
  }
  const userFollows = loggedInUser?.following.find(u => u.username == user.username)
  const renderFollowString = () =>
    userFollows ? "Unfollow" : "Follow"

  const handleClick = () => {
    if (!isLoggedIn)
      toast(LoginToastComponent({action: `Follow ${user.username}`, handleClick: handleToastButtonClick}), {autoClose: 5000})
    else {
      const formdata = new FormData()
      formdata.append("Username", user.username.trim())
      apiClient.patch("/accounts/follow", 
                      formdata, 
                      {headers: 
                        {'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`, "Content-Type": "multipart/form-data"}})
                        .then(() => {
                          queryClient.invalidateQueries({queryKey: ["me"]})
                          queryClient.invalidateQueries({queryKey: ["profile", user.username]})
                        })
                        .catch(err => console.log(err))
    }
  }

  const renderIconOnly = () => {
    console.log(userFollows)
    return userFollows ? 
          <RiUserUnfollowFill onClick={handleClick} className="icon" color="red" fontSize={16}/> : 
          <TiUserAdd onClick={handleClick} className="icon" color="#03fc98" fontSize={18}/>
  }

  const renderWithProfileImage = () => {
    return (
      <>
        <ProfileImage customClass="btn--follow__img--md" user={user}/> {renderFollowString()} {user.username}
      </>
    )
  }
  return (
    <>
      <ToastContainer position="top-center"/>
      {loggedInUser?.username!= user.username ?
          (removeImage ? 
           renderIconOnly():
           <button className={`btn ${removeImage ? "btn--sm " : "btn--success btn--md "} ${removeImage ? "btn--follow--icon-only" : "btn--follow"}`} 
           onClick={handleClick}>{renderWithProfileImage()}</button>) : <></>}      
    </>
  )
}
