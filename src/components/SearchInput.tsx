import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import useQueryStore from "../stores/useQueryStore";
export const SearchInput = () => {

  const [searchInput, setSearchInput] = useState("")
  const searchDiv = useRef<HTMLDivElement>(null)
  const searchIcon = useRef<HTMLElement>(null)
  const inputElement = useRef<HTMLInputElement>(null)

  const { handleSearch } = useQueryStore()
  useEffect(() => {
    if (searchDiv && searchDiv.current) {
      searchDiv.current.addEventListener('mouseenter', () => {
        if (searchDiv.current) searchDiv.current.style.backgroundColor = 'white'
        if (inputElement.current) inputElement.current.style.color = '#202020'
        if (searchIcon.current) searchIcon.current.style.color = '#202020'
      })
      searchDiv.current.addEventListener('mouseleave', () => {
        if (searchDiv.current) searchDiv.current.style.backgroundColor = '#202020'
        if (inputElement.current) inputElement.current.style.color = 'white'
        if (searchIcon.current) searchIcon.current.style.color = 'white'
      })
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == 'Enter')
      handleSearch(searchInput.length > 0 ? searchInput : '')
  }

  return (
    <div className="search-input" ref={searchDiv}>
        <FaSearch className="icon" ref={searchIcon}/>
        <input type="text" placeholder="Search"
               onChange={(event) => setSearchInput(event.target.value)}
               ref={inputElement} onKeyDown={(event) => handleKeyDown(event)}/>
    </div>
  )
}
