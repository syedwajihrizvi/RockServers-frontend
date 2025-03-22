import { FaSearch } from "react-icons/fa";
export const SearchInput = () => {
  return (
    <div className="search-input">
        <FaSearch className="icon"/>
        <input type="text" placeholder="Search"/>
    </div>
  )
}
