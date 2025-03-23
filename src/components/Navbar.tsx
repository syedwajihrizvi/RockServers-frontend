import { Toggle } from "./Toggle";
import { SearchInput } from "./SearchInput";
import Dropdown from "./Dropdown";

const isLoggedIn = true

export const Navbar = () => {
  return (
    <div className="nav">
        <div className="nav__img__container">
            <h3 className="title">ROCKSERVERS</h3>
        </div>
        <SearchInput/>
        <div className="nav__options">
            <Toggle/>
            {isLoggedIn && <Dropdown/>}
            {!isLoggedIn && 
            <button className="btn btn--secondary btn--md">
              Sign Up
            </button>}
        </div>
    </div>
  )
}
