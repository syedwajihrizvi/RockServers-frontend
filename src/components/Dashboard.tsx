import { useQueryClient } from "@tanstack/react-query"
import { ReactNode, useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useGlobalContext } from "../providers/global-provider"
import { Skeleton } from "./Skeleton"
import { AllPosts } from "./AllPosts"
import { ToastContainer, toast } from "react-toastify"
import { INotification, IUser, Notification} from "../utils/interfaces/Interfaces"
import apiClient, { updateUserSettings } from "../utils/services/dataServices"
import { formatStringDate } from "../utils/helpers/helpers"
import { useNotifications } from "../hooks/useNotifications"
import { FollowButton } from "./FollowButton"
import { ProfileImage } from "./ProfileImage"

const CustomChangeInput = ({label, placeholder, type, field, password}: 
    {label: string, placeholder: string, type: string, field: string, password: string}) => {
    const [showActions, setShowActions] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const queryClient = useQueryClient()
    const handleSubmit = () => {
        const formData = new FormData()
        formData.append("confirmPassword", password)
        formData.append(field, inputValue)
        toast.promise(
            updateUserSettings(formData, field).then(() => {
                toast.dismiss()
                setShowActions(false)
                setInputValue("")
                queryClient.invalidateQueries({queryKey: ["me"]})
            }),
            {
                pending: "Updating Information...",
                success: "Updated successfully",
                error: "Error updating user information"
            }
        )
    }

    return (
        <div>
            <label>
                {label}
            </label>
            <div className="input-wrapper" onFocus={() => setShowActions(true)}>
                <input type={type} placeholder={placeholder} value={inputValue}
                       onChange={(event) => setInputValue(event.target.value)}/>
                {showActions &&
                <div className="input-actions">
                    <button className="btn btn--success btn--xs" onClick={handleSubmit}>Submit</button>
                    <button className="btn btn--danger btn--xs" onClick={() => {
                        setInputValue("")
                        setShowActions(false)
                    }}>Cancel</button>
                </div>}
            </div>
            <ToastContainer position="top-center"/>
        </div>
    )
}

export const Profile = ({user}: {user: IUser}) => {
    return (
        <div className="profile">
            <div className="profile__header">
                <ProfileImage customClass="profile__img" user={user}/>
                <div className="profile__actions">
                    <h3 className="profile__username">{user?.username}</h3>
                    <FollowButton user={user} removeImage={true}/>
                </div>
            </div>
            <div className="profile__content">
                <div className="profile__info">
                    <h5>{user && user.following ? user.following.length : 0}</h5>
                    <h4>Following</h4>
                </div>
                <div className="profile__info">
                    <h5>{user && user.followers ? user.followers.length : 0}</h5>
                    <h4>Followers</h4>
                </div>
                <div className="profile__info">
                    <h5>{user && user.totalPostings ? user.totalPostings : 0}</h5>
                    <h4>Posts</h4>
                </div>
            </div>
        </div>
    )
}

const AccountSettings = ({user}: {user: IUser}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [verified, setVerified] = useState(false)
    const [password, setPassword] = useState("")

    const handleLogout = () => {
        localStorage.removeItem('x-auth-token')
        queryClient.refetchQueries({queryKey: ["me"]}).then(() => navigate('/'))
    }

    const handleSubmit = () => {
        apiClient.post("/accounts/login", {emailOrUsername: user.username, password: password}, 
            { headers: {"Authorization": `Bearer ${localStorage.getItem('x-auth-token')}`}})
                 .then(() => setVerified(true))
                 .catch(() => toast.error("Invalid Password Entered."))
    }

    return (
        <div className="account-settings">
            {verified ? 
            <>
                <CustomChangeInput label="Update Email" placeholder="Enter new email" type="text" field="email" password={password}/>
                <CustomChangeInput label="Update Username" placeholder="Enter new username" type="text" field="username" password={password}/>
                <CustomChangeInput label="Update Password" placeholder="Enter new password" type="password" field="password" password={password}/>
            </> :
            <>
                <ToastContainer position="top-center"/>
                <h2 className="verify-heading">
                    Please confirm password to access account settings
                </h2>
                <div className="input-wrapper">
                    <input type="password" placeholder="Enter Password" 
                        onChange={(event) => setPassword(event.target.value)}/>
                    <button className="btn btn--success btn--md" onClick={handleSubmit}>Confirm</button>
                </div>
            </>
            }
            <button className="btn btn--success btn--md" onClick={handleLogout}>Logout</button>
        </div> 
    )
}

export const UserList = ({type, profileUser, authenticated}: 
    {type: "followers" | "following", profileUser: IUser, authenticated: boolean}) => {
    const { user: loggedInUser } = useGlobalContext()
    const queryClient = useQueryClient()
    const renderButton = (renderUser: IUser) => {

        const handleFollow = () => {
            const formData = new FormData()
            formData.append("Username", renderUser.username.trim())
            apiClient.patch('/accounts/follow', formData, 
                {headers: 
                    {
                        'Authorization': `Bearer ${localStorage.getItem('x-auth-token')}`, 
                        "Content-Type": "multipart/form-data"}})
                .then(() => queryClient.invalidateQueries({queryKey: ["me"]}))
                .catch(err => console.log(err))
        }

        if (type == "following") {
            return (
                profileUser.followers.find(u => u.id == renderUser.id) ?
                <button className="btn btn--success btn--xs">Follows You</button> :
                <button onClick={handleFollow} className="btn btn--success btn--xs">Unfollow</button>)
        } else {
            return (
                profileUser.following.find(u => u.id == renderUser.id) ? 
                <button className="btn btn--success btn--xs">Follows You</button> :
                <button onClick={handleFollow} className="btn btn--success btn--xs">Follow Back</button>
            )
        }
    }

    const userList = type == "following" ? profileUser.following : profileUser.followers
    if (userList.length == 0)
        return (
    type == "following" ? 
    <h1 className="user-list-empty-heading">
        {authenticated ? "You are not following anyone" : `${profileUser.username} is not following anyone.` }
    </h1> : 
    <h1 className="user-list-empty-heading">
        {authenticated ? "You currently have no followers" : `${profileUser.username} has no followers.`}
    </h1>)
    const renderLink = (user: IUser) =>
        user.username == loggedInUser?.username ? "/dashboard/settings" : `/profile/${user.username}`

    return (
        <div className="friends">
            {userList.map((user) => (
                <div className="friend">
                    <Link to={renderLink(user)} style={{textDecoration: 'none'}}>
                        <div className="friend__info">
                        <ProfileImage user={user}/>
                            <h3>{user.username}</h3>
                        </div>
                    </Link>
                    {authenticated && 
                    <div className="friend__actions">
                        {renderButton(user)}
                    </div>}
                </div>
            ))}
        </div>
    )
}

export const Posts = ({user, viewingProfile}: {user: IUser, viewingProfile?: boolean}) => {
    
    return (
        user.totalPostings > 0 ? <AllPosts userId={user.id}/> : 
        <div className="no-posts">
            <h2 className="no-posts__heading">
                {!viewingProfile ? "You have no posts. Create one" : "No Posts."}
            </h2>
            <Link to="/create" className="no-posts__link">
                <button className="btn btn--success btn--md">Create</button>
            </Link>
        </div>
    )
}

const Notifications = () => {
    const { data: notifications } = useNotifications()
    const queryClient = useQueryClient()
    const renderContentType = (contentType: number, entityContent: string) => {
        if (contentType == Notification.Follow)
            return "started following you."
        else if (contentType == Notification.PostCommentLike || contentType == Notification.DiscussionCommentLike)
            return `liked your comment on ${entityContent}.`
        else if (contentType == Notification.PostLike)
            return `liked your post: ${entityContent}.`
        else if (contentType == Notification.DiscussionLike)
            return `liked your discussion: ${entityContent}`
        else if (contentType == Notification.PostComment || contentType == Notification.DiscussionComment)
            return `commented on your post: ${entityContent}`
        else if (contentType == Notification.PostCommentReplyLike || contentType == Notification.DiscussionCommentReplyLike)
            return `liked your reply on ${entityContent}`
        else
            return `replied to your comment on ${entityContent}`
    }

    const renderNotificationUrl = (notification: INotification) => {
        const {type: contentType, entityId, engager} = notification
        if (contentType == Notification.Follow)
            return `/profile/${engager.username}`
        else if (contentType == Notification.PostComment)
            return `/posts/${entityId}`
        else if (contentType == Notification.PostCommentLike)
            return `/posts/${entityId}`
        else if (contentType == Notification.DiscussionCommentLike)
            return `/discussions/${entityId}`
        else if (contentType == Notification.PostLike)
            return `/posts/${entityId}`
        else if (contentType == Notification.DiscussionComment)
            return `/discussions/${entityId}`
        else if (contentType == Notification.PostCommentReplyLike)
            return `/discussions/${entityId}`
        else if (contentType == Notification.DiscussionCommentReplyLike)
            return `/discussions/${entityId}`
        else if (contentType == Notification.ReplyPostComment)
            return `/discussions/${entityId}`
        else if (contentType == Notification.ReplyDiscussionComment)
            return `/discussions/${entityId}`
        else
            return ""
    }

    const renderNotification = (notification: INotification) => {
        return (
            <Link to={renderNotificationUrl(notification)} style={{textDecoration: "none"}}>
                <div className="notification">
                    {!notification.isRead && <div className="notification__read"/>}
                    <div className="notification__content">
                        <ProfileImage user={notification.engager}/>
                        <p className="notification__content__msg">
                            {`@${notification.engager.username} ${renderContentType(notification.type, notification.entityContent)}`}
                        </p>
                    </div>
                    <p className="notification__content__time">{formatStringDate(notification.createdAt)}</p>
                </div>
            </Link>
        )
    }

    const handleDelete = () => {
        apiClient.delete(
            '/notifications', {headers: {Authorization: `Bearer ${localStorage.getItem('x-auth-token')}`}})
            .then(() => queryClient.invalidateQueries({queryKey: ["notifications"]}))
    }

    return notifications && notifications.length > 0 ?
    <div className="notifications">
        <button className="btn btn--md btn--success btn--delete" onClick={handleDelete}>Clear All</button>
        {notifications.map(notification => (renderNotification(notification)))}
    </div> : <h2 className="notifications__no-notificatons--heading">You have no Notifications</h2>
}

export const Dashboard = (
    {renderComponent, navComponents, user, initialState}: 
    {renderComponent: (viewComponent: string, user: IUser) => ReactNode, navComponents: string[], user: IUser, initialState?: string}) => {
  const [viewComponent, setViewComponent] = useState(initialState ? initialState : navComponents[0])
  const [screenWidth, setScreenWidth] = useState(window.screen.width)

  useEffect(() => {
    const handleResize = () => {
        setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="dashboard">
        {screenWidth < 768 && 
        <div className="dashboard__header">
            {navComponents.map(comp => 
                <h3 
                    className={`${comp == viewComponent ? "active" : ""}`} 
                    onClick={() => setViewComponent(comp)}>
                        {`${comp[0].toUpperCase()}${comp.substring(1)}`}
                </h3>
            )}
        </div>}
        {screenWidth >= 768 && 
        <div className="dashboard__sidebar">
            {navComponents.map(comp => 
                <h3 className={`${comp == viewComponent ? "active" : ""}`} 
                    onClick={() => setViewComponent(comp)}>
                    {`${comp[0].toUpperCase()}${comp.substring(1)}`}
                </h3>
            )}
        </div>}
        <div className="dashboard__content">
            <Profile user={user}/>
            {renderComponent(viewComponent, user)}
        </div>
    </div>
  )
}

export const UserProfileDashboard = () => {
    const navComponents = ["Settings", "Followers", "Following", "My Posts", "Notifications"]
    const { isLoading, user } = useGlobalContext()
    const {pathname} = useLocation()
    
    const getInitialState = () => {
        if (pathname.includes("followers"))
            return "Followers"
        else if (pathname.includes("following"))
            return "Following"
        else if (pathname.includes("posts"))
            return "My Posts"
        else if (pathname.includes("notifications"))
            return "Notifications"
        return "Settings"
    }

    const renderComponent = (viewComponent: string, user: IUser) => {
        switch (viewComponent) {
            case "Settings":
                return <AccountSettings user={user}/>
            case "Followers":
                return <UserList type="followers" profileUser={user} authenticated={true}/>
            case "Following":
                return <UserList type="following" profileUser={user} authenticated={true}/>
            case "My Posts":
                return <Posts user={user}/>
            case "Notifications":
                return <Notifications/>
            default:
                return <AccountSettings user={user}/>
        }
      }
      return isLoading ? 
        <Skeleton/> :
        <Dashboard renderComponent={renderComponent} navComponents={navComponents} user={user as IUser} initialState={getInitialState()}/>   
}
