import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Avatar from "../assets/images/avatar.webp"

const CustomChangeInput = ({label, placeholder, type}: {label: string, placeholder: string, type: string}) => {
    const [showActions, setShowActions] = useState(false)

    return (
        <>
            <label>
                {label}
            </label>
            <div className="input-wrapper" onFocus={() => setShowActions(true)} onBlur={() => setShowActions(false)}>
                <input type={type} placeholder={placeholder}/>
                {showActions &&
                <div className="input-actions">
                    <button className="btn btn--success btn--xs">Submit</button>
                    <button className="btn btn--danger btn--xs">Cancel</button>
                </div>}
            </div>
        </>
    )
}

const AccountSettings = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const handleLogout = () => {
        localStorage.removeItem('x-auth-token')
        queryClient.invalidateQueries({queryKey: ["me"]})
        navigate('/')
    }

    return (
        <div className="account-settings">
            <CustomChangeInput label="Update Email" placeholder="Enter new email" type="text"/>
            <CustomChangeInput label="Update Password" placeholder="Enter new password" type="password"/>
            <CustomChangeInput label="Update Username" placeholder="Enter new username" type="text"/>
            <button className="btn btn--success btn--md" onClick={handleLogout}>Logout</button>
        </div>
    )
}

const Friends = () => {
    return (
        <div className="friends">
            {Array.from(Array(10).keys()).map(() => (
                <div className="friend">
                    <div className="friend__info">
                        <img src={Avatar}/>
                        <h3>Username</h3>
                    </div>
                    <div className="friend__actions">
                        <button className="btn btn--success btn--xs">Posts</button>
                        <button className="btn btn--golden btn--xs">Discussions</button>
                        <button className="btn btn--danger btn--xs">Remove</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const Posts = () => {
    return (
        <h1>Posts</h1>
    )
}

const Discussions = () => {
    return (
        <h1>Discussions</h1>
    )
}

const Notifications = () => {
    return (
        <h1>Notifications</h1>
    )
}
export const Dashboard = () => {
  const [viewComponent, setViewComponent] = useState("account")
  const navComponents = [
    "account", "friends", "posts", "discussions", "notifications"
  ]
  const [screenWidth, setScreenWidth] = useState(window.screen.width)

  useEffect(() => {
    const handleResize = () => {
        setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderComponent = () => {
    switch (viewComponent) {
        case "account":
            return <AccountSettings/>
        case "friends":
            return <Friends/>
        case "posts":
            return <Posts/>
        case "discussions":
            return <Discussions/>
        case "notifications":
            return <Notifications/>
        default:
            return <AccountSettings/>
    }
  }
  return (
    <div className="dashboard">
        {screenWidth < 768 && 
        <div className="dashboard__header">
            {navComponents.map(comp => 
                <h3 className={`${comp == viewComponent ? "active" : ""}`} 
                    onClick={() => setViewComponent(comp)}>{`${comp[0].toUpperCase()}${comp.substring(1)}`}</h3>
            )}
        </div>}
        {screenWidth >= 768 && 
        <div className="dashboard__sidebar">
            {navComponents.map(comp => 
                <h3 className={`${comp == viewComponent ? "active" : ""}`} onClick={() => setViewComponent(comp)}>
                    {`${comp[0].toUpperCase()}${comp.substring(1)}`}</h3>
            )}
        </div>}
        <div className="dashboard__content">
            {renderComponent()}
        </div>
    </div>
  )
}
