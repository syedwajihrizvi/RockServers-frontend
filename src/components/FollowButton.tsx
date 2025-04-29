import { ToastContainer, toast } from 'react-toastify'
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../providers/global-provider";
import apiClient from "../utils/services/dataServices"
import { useQueryClient } from "@tanstack/react-query";
import { generateProfileImageUrl } from '../utils/helpers/helpers';
import { IUser } from '../utils/interfaces/Interfaces';

export const FollowButton = ({user}: {user: IUser}) => {
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
                        .then(() => queryClient.invalidateQueries({queryKey: ["me"]}))
                        .catch(err => console.log(err))
    }
  }

  return (
    <>
      <ToastContainer position="top-center"/>
      {loggedInUser?.username!= user.username && <button className="btn btn--success btn--md btn--follow" onClick={handleClick}>
          <img src={generateProfileImageUrl(user)}/>{renderFollowString()} {user.username}
      </button>}
    </>
  )
}
