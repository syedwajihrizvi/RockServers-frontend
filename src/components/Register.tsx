export const Register = () => {
  return (
    <div className="account-input">
      <div className="account-input__header">
        <h1 className="account-input__heading">Sign Up Now</h1>
        <p className="account-input__subtitle">Join the community and improve your Rockstar Experience!</p>
      </div>
        <input type="text" placeholder="Enter your Email"/>
        <input type="text" placeholder="Enter your Username"/>
        <input type="text" placeholder="Enter your First Name"/>
        <input type="text" placeholder="Enter your Last Name"/>
        <input type="text" placeholder="Enter your Psn"/>
        <input type="password" placeholder="Enter Password"/>
        <button className="account-input__btn">Sign Up</button>
        <span className="account-input__join-now">Already have an account? <a href="/account/login">Sign In</a></span>
    </div>
  )
}
