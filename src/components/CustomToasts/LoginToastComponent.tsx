export const LoginToastComponent = ({action, handleClick}:{action: string, handleClick: () => void}) => {
    return (
        <div className="toast-login">
            <h1 className="toast-login__heading">Please Login To {action}</h1>
            <button className="toast-login__btn" onClick={handleClick}>Login</button>
        </div>
    )
}