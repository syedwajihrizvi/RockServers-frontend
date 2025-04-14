import { SearchInput } from "./SearchInput";
import { FaCirclePlus } from "react-icons/fa6";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useQueryStore from "../stores/useQueryStore";
import { useGlobalContext } from "../providers/global-provider";

export const Navbar = () => {
  const navigate = useNavigate()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const { handleResetAll } = useQueryStore()
  const { isLoggedIn } = useGlobalContext()
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth > 768 ? (
    <div className="nav">
        <div className="nav__img__container">
            <h3 className="title" onClick={() => {
              handleResetAll()
              navigate('/')}
            }>ROCKSERVERS</h3>
        </div>
        <SearchInput/>
        <div className="nav__options">
            {isLoggedIn && 
            <>
            <FaCirclePlus className="create_icon" size={30}/>
            <Dropdown/>
            </>}
            {!isLoggedIn && 
            <button className="btn btn--secondary btn--md" onClick={() => navigate('/account/register')}>
              Sign Up
            </button>}
        </div>
    </div>
  ) : (
    <div style={{display:"flex", flexDirection: 'column'}}>
      <div className="nav">
        <div className="nav__img__container">
            <h3 className="title" onClick={() => navigate('/')}>ROCKSERVERS</h3>
        </div>
        <div className="nav__options">
            {isLoggedIn && 
            <>
            <FaCirclePlus className="create_icon" size={30}/>
            <Dropdown/>
            </>
            }
            {!isLoggedIn && 
            <button className="btn btn--secondary btn--md">
              Sign Up
            </button>}
        </div>
    </div>
    <SearchInput/>
    </div>
  )
}
