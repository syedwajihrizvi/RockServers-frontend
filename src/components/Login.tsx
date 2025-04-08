export const Login = () => {
  return (
    <div className="account-input">
      <div className="account-input__header">
        <h1 className="account-input__heading">Sign In</h1>
        <p className="account-input__subtitle">Improve your Rockstar experience!</p>
      </div>
        <input type="text" placeholder="Email or Username"/>
        <input type="password" placeholder="Password"/>
        <span className="account-input__forgot"><a href="#">Forgot Password</a></span>
        <button className="account-input__btn">Sign In</button>
        <span className="account-input__join-now">No Account? <a href="/account/register">Join Now</a></span>
    </div>
  )
}
