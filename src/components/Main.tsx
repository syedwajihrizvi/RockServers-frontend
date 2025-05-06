import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { MiniCountdown } from "./Countdown"

export const Main = () => {
  return (
    <div className="main-container">
        <MiniCountdown/>
        <Navbar/>
        <Outlet/>
    </div>
  )
}
