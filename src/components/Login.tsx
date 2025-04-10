import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useEffect, useState } from "react"
import apiClient from "../utils/services/dataServices"
import { IUser } from "../utils/interfaces/Interfaces";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from '@tanstack/react-query'
import { useGlobalContext } from "../providers/global-provider";

export const Login = () => {
  const [form, setForm] = useState<{emailOrUsername: string, password: string}>({emailOrUsername: "", password: ""})
  const queryClient = useQueryClient()
  const [viewPassword, setViewPassword] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const navigate = useNavigate()
  const { isLoggedIn } = useGlobalContext()
  // If logged in, then just navigate to main page
  useEffect(() => {
    if (isLoggedIn)
      navigate('/')
  })

  const handleFormSubmit = () => {
    const { emailOrUsername, password } = form
    if (!emailOrUsername || emailOrUsername.length == 0 || !password || password.length == 0)
      setLoginError(true)
    apiClient.post<IUser>("/accounts/login", {emailOrUsername, password})
    .then(res => {
      const jwt = res.data.token
      localStorage.setItem('x-auth-token', jwt)
      queryClient.invalidateQueries({ queryKey: ['me']})
      setInterval(() => {
        navigate('/')
      }, 1000)
    })
    .catch(() => setLoginError(true))
  }

  return (
    <div className="account-input">
      <div className="account-input__header">
        <h1 className="account-input__heading">Sign In</h1>
        <p className="account-input__subtitle">Improve your Rockstar experience!</p>
      </div>
        <input className="account-input__input account-input__input--fw" 
               type="text" placeholder="Email or Username" 
               onChange={(event) => {
                setLoginError(false)
                setForm({...form, emailOrUsername: event.target.value})
              }}/>
        <span className="account-input__password">
        <input className="account-input__input account-input__input--fw" 
               type={viewPassword ? "text" : "password"} placeholder="Password"
               onChange={(event) => {
                setLoginError(false)
                setForm({...form, password: event.target.value})
              }}/>
          {viewPassword ? <IoIosEyeOff className="account-input__password__icon" onClick={() => setViewPassword(false)}/> : 
                          <IoIosEye className="account-input__password__icon" onClick={() => setViewPassword(true)}/>}
        </span>
        {loginError &&
        <span className="account-input__login-error">
          <h3>Invalid Username or Password</h3>
        </span>}
        <span className="account-input__forgot"><a href="#">Forgot Password</a></span>
        <button className="account-input__btn" onClick={() => handleFormSubmit()}>Sign In</button>
        <span className="account-input__join-now">No Account? <a href="/account/register">Join Now</a></span>
    </div>
  )
}
