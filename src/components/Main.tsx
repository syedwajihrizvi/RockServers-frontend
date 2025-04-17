import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const Main = () => {
  return (
    <div className="main-container">
        <Navbar/>
        <Outlet/>
    </div>
  )
}
