import { useParams } from "react-router-dom"
import { useProfile } from "../hooks/useUser"
import { Dashboard, Posts, UserList } from "./Dashboard"
import { IUser } from "../utils/interfaces/Interfaces"
import { Skeleton } from "./Skeleton"
import { Navbar } from "./Navbar"

export const ViewProfile = () => {
  const params = useParams()
  const {data: profileToView, isLoading} = useProfile(params.username as string)
  const navComponents = ["posts", "followers", "following"]

    const renderComponent = (viewComponent: string) => {
        switch (viewComponent) {
            case "followers":
                return <UserList type="followers" profileUser={profileToView as IUser} authenticated={false}/>
            case "following":
                return <UserList type="following" profileUser={profileToView as IUser} authenticated={false}/>
            default:
                return <Posts user={profileToView as IUser} viewingProfile={true}/>
        }
      }

  return isLoading ? 
    <Skeleton/> :
    <>
      <Navbar/>
      <Dashboard renderComponent={renderComponent} navComponents={navComponents} user={profileToView as IUser}/>
    </>
}
