import Logo from "../assets/images/logo.png"
import { MdManageAccounts } from "react-icons/md";
import { Toggle } from "./Toggle";
import { SearchInput } from "./SearchInput";

const isLoggedIn = false

export const Navbar = () => {
  return (
    <div className="nav">
        <div className="nav__img__container">
            <img src={Logo}/>
        </div>
        <SearchInput/>
        <div className="nav__options">
            <Toggle/>
            {isLoggedIn && <MdManageAccounts className="icon"/>}
            {!isLoggedIn && 
            <button className="btn btn--secondary btn--md">
              Sign Up
            </button>}
        </div>
    </div>
  )
}
