import { useState } from "react"
import { registerUser } from "../utils/services/dataServices"
import { useNavigate } from "react-router-dom"
import { useAvatars } from "../hooks/useAvatars"
import { generateAvatarImageUrl } from "../utils/helpers/helpers"
import { IAvatar } from "../utils/interfaces/Interfaces"
import { toast, ToastContainer } from "react-toastify"


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
  const [selectingAvatar, setSelectingAvatar] = useState(false)
  const [avatarSelected, setAvatarSelected] = useState("")
  const [imageUploaded, setImageUploaded] = useState<Blob | MediaSource | undefined>(undefined)
  const { data: avatars } = useAvatars()
  const navigate = useNavigate()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files)
      return
    const file = event.target.files[0]
    if (!file)
      return
    setAvatarSelected("")
    setImageUploaded(file)
  }

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
    const formData = new FormData()
    formData.append("firstName", firstName as string)
    formData.append("lastname", lastName as string)
    formData.append("email", email as string)
    formData.append("username", username as string)
    formData.append("password", password as string)
    if (avatarSelected)
      formData.append("avatar", avatarSelected)
    else
      formData.append("imageFile", imageUploaded as Blob)
    toast.promise(
      registerUser(formData).then(() => {
        toast.dismiss()
        navigate('/account/login')
      }),
      {
        pending: "Signing Up...",
        success: "Successfully created account",
        error: "An unexpected error occured"
      }
    )
  }

  const handleSelectingAvatar = (avt: IAvatar) => {
    setImageUploaded(undefined)
    setAvatarSelected(avatarSelected == avt.name ? "" : avt.name)
  }

  const renderUploadedImagePreview = () => {
    if (imageUploaded) {
      const imageUrl = URL.createObjectURL(imageUploaded)
      return (
        <div className="avatar-preview__wrapper">
        <img className="avatar-preview" src={imageUrl}/>
        <h3 className="divider--heading">Or</h3>
        <button className="btn btn--success btn--md" onClick={() => setImageUploaded(undefined)}>
          Choose new Profile Picture
        </button>
      </div>
      )
    }
  }

  return (
    <div className="register-container">
      <ToastContainer position="top-center"/>
      {selectingAvatar &&
      <div className="avatar-picker__wrapper">
        { avatars && <div className="avatar-picker">
          {avatars.map((avt) => 
            <img key={avt.id} onClick={() => handleSelectingAvatar(avt)}
                 src={generateAvatarImageUrl(avt.name)} style={{border: avt.name == avatarSelected ? "3px solid #03fc98" : ""}}/>)}
        </div>}
        <div className="avatar-picker__actions">
          <button className="btn btn--success btn--md" onClick={() => setSelectingAvatar(false)}>Done</button>
          <button onClick={() => setSelectingAvatar(false)} className="btn btn--danger btn--md">Cancel</button>
        </div>  
      </div>}
      <div className="account-input" style={{opacity: selectingAvatar ? 0.1 : 1}}>
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
        {!avatarSelected && !imageUploaded && <div className="account-input__profile-pic-chooser">
          <div className="account-input__wrapper">
            <label className="file-upload-wrapper btn btn--success btn--md">
              Upload an Image
              <input type="file" onChange={handleFileUpload}/>
            </label>
          </div>
          <h3 className="divider--heading">Or</h3>
          <button className="btn btn--success btn--md" onClick={() => setSelectingAvatar(true)}>
            Choose An Avatar
          </button>
        </div>}
        {avatarSelected && 
        <div className="avatar-preview__wrapper">
          <img className="avatar-preview" src={generateAvatarImageUrl(avatarSelected)}/>
          <h3 className="divider--heading">Or</h3>
          <button className="btn btn--success btn--md" onClick={() => setAvatarSelected("")}>
            Choose new Profile Picture
          </button>
        </div>}
        {imageUploaded && renderUploadedImagePreview()}
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
        <div className="sign-up-actions-wrapper">
          <button className="account-input__btn" onClick={() => handleSubmit()}>Sign Up</button>
          <span className="account-input__input account-input__input--fw">
            Already have an account? <a href="/account/login">Sign In</a>
          </span>
        </div>
      </div>
    </div>
  )
}
