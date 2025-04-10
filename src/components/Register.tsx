import { useState } from "react"
import apiClient from "../utils/services/dataServices"
import { useNavigate } from "react-router-dom"

interface RegisterForm {
  email?: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  password?: string,
  confirmPassword?: string
}

interface Errors {
  email?: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  password?: string,
  confirmPassword?: string
}

export const Register = () => {
  const [register, setRegister] = useState<RegisterForm>({})
  const [errors, setErrors] = useState<Errors>({})
  const navigate = useNavigate()
  const handleSubmit = () => {
    const { email, username, firstName, lastName, password, confirmPassword } = register
    // Basic client side validation
    const newErrors = {
      email: email ? "" : "Email field must not be empty",
      username: username ? "" : "Username field must not be empty",
      firstName: firstName ? "" : "Firstname field must not be empty",
      lastName: lastName ? "" : "Lastname field must not be empty",
      password: password ? "" : "Password field must not be empty",
      confirmPassword: confirmPassword ? "" : "Please confirm your password",
    }
  
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Password fields do not match"
      newErrors.password = ""
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg != "")
    if (hasErrors) return
  
    // Send request to create user
    const requestData = {firstName, lastName, email, username, password}
    apiClient.post("/accounts/register", requestData)
             .then(res => {
              // TODO: Add toast to show successful creation
              console.log(res.data)
              navigate('/account/login')}
            )
             .catch(err => console.log(err))
    console.log(register)
  }

  return (
    <div className="account-input">
      <div className="account-input__header">
        <h1 className="account-input__heading">Sign Up Now</h1>
        <p className="account-input__subtitle">Join the community and improve your Rockstar Experience!</p>
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, email: ""}) 
          setRegister({...register, email: event.target.value})}} type="text" 
               className="account-input__input account-input__input--fw" placeholder="Enter your Email"/>
        {errors.email && <p className="account-input__error">{errors.email}</p>}
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, username: ""})
          setRegister({...register, username: event.target.value})}} type="text" 
                className="account-input__input account-input__input--fw" placeholder="Enter your Username"/>
        {errors.username && <p className="account-input__error">{errors.username}</p>}
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, firstName: ""})
          setRegister({...register, firstName: event.target.value})}} type="text" 
                className="account-input__input account-input__input--fw" placeholder="Enter your First Name"/>
        {errors.firstName && <p className="account-input__error">{errors.firstName}</p>}
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, lastName: ""})
          setRegister({...register, lastName: event.target.value})}} type="text" 
                className="account-input__input account-input__input--fw" placeholder="Enter your Last Name"/>
        {errors.lastName && <p className="account-input__error">{errors.lastName}</p>}
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, password: ""})
          setRegister({...register, password: event.target.value})}} 
                className="account-input__input account-input__input--fw" 
                type="password" placeholder="Enter Password"/>
        {errors.password && <p className="account-input__error">{errors.password}</p>}
      </div>
      <div className="account-input__wrapper">
        <input onChange={(event) => {
          setErrors({...errors, confirmPassword: ""})
          setRegister({...register, confirmPassword: event.target.value})}} 
                className="account-input__input account-input__input--fw" 
                type="password" placeholder="Confirm Password"/>
        {errors.confirmPassword && <p className="account-input__error">{errors.confirmPassword}</p>}
      </div>
        <button className="account-input__btn" onClick={() => handleSubmit()}>Sign Up</button>
        <span className="account-input__input account-input__input--fw">Already have an account? <a href="/account/login">Sign In</a></span>
    </div>
  )
}
