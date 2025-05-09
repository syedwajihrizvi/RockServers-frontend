import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import useQueryStore from "../stores/useQueryStore";
import { useNavigate } from "react-router-dom";
export const SearchInput = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState("")
  const searchDiv = useRef<HTMLDivElement>(null)
  const searchIcon = useRef<HTMLSpanElement>(null)
  const inputElement = useRef<HTMLInputElement>(null)

  const { handleSearch } = useQueryStore()

  useEffect(() => {
    if (searchDiv && searchDiv.current) {
      searchDiv.current.addEventListener('mouseenter', () => {
        if (searchDiv.current) searchDiv.current.style.backgroundColor = 'white'
        if (inputElement.current) inputElement.current.style.color = '#202020'
        if (searchIcon.current) {
          searchIcon.current.classList.remove('search-input__icon-wrapper--not-enter')
          searchIcon.current.classList.add('search-input__icon-wrapper--enter')
        }
      })
      searchDiv.current.addEventListener('mouseleave', () => {
        if (searchDiv.current) searchDiv.current.style.backgroundColor = '#202020'
        if (inputElement.current) inputElement.current.style.color = 'white'
        if (searchIcon.current) {
          searchIcon.current.classList.remove('search-input__icon-wrapper--enter')
          searchIcon.current.classList.add('search-input__icon-wrapper--not-enter')
        }
      })
    }
  }, [])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      navigate('/')
      handleSearch(searchInput.length > 0 ? searchInput : '')
    }

  }

  return (
    <div className="search-input" ref={searchDiv}>
        <span className="search-input__icon-wrapper--not-enter" ref={searchIcon}>
          <FaSearch className="icon"/>
        </span>
        <input type="text" placeholder="Search for games, characters, RP Servers, anything"
               onChange={(event) => setSearchInput(event.target.value)}
               ref={inputElement} onKeyDown={(event) => handleKeyDown(event)}/>
    </div>
  )
}
