import Avatar from "../assets/images/avatar.webp"
import { ToastContainer, toast } from 'react-toastify'
import { LoginToastComponent } from "./CustomToasts/LoginToastComponent";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../providers/global-provider";
import apiClient from "../utils/services/dataServices"

export const FollowButton = ({username}: {username: string}) => {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useGlobalContext()
  const handleToastButtonClick = () => {
    navigate('/account/login')
  }
  console.log(user?.following)
  const renderFollowString = () =>
    user?.following.includes(username) ? "Unfollow" : "Follow"

  const handleClick = () => {
    if (!isLoggedIn)
      toast(LoginToastComponent({action: `Follow ${username}`, handleClick: handleToastButtonClick}), {autoClose: 5000})
    else {
      const formdata = new FormData()
      formdata.append("Username", username.trim())
      apiClient.patch("/accounts/follow", 
                      formdata, 
                      {headers: 
                        {'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`, "Content-Type": "multipart/form-data"}})
                        .then(res => console.log(res.data)).catch(err => console.log(err))
    }
  }

  return (
    <>
    <ToastContainer position="top-center"/>
    <button className="btn btn--success btn--md btn--follow" onClick={handleClick}>
        <img src={Avatar}/>{renderFollowString()} {username}
    </button>
    </>
  )
}
