import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
export const SearchInput = () => {

  useEffect(() => {
    const searchInput = document.querySelector('.search-input') as HTMLDivElement
    const searchIcon = searchInput.querySelector('.icon') as HTMLElement
    const inputElement = searchInput.querySelector('input') as HTMLInputElement
    searchInput?.addEventListener('mouseenter', () => {
      searchInput.style.backgroundColor = 'white'
      inputElement.style.color = '#202020'
      searchIcon.style.color = '#202020'
    })
    searchInput?.addEventListener('mouseleave', () => {
      searchInput.style.backgroundColor = '#202020'
      inputElement.style.color = 'white'
      searchIcon.style.color = 'white'
    })
  }, [])

  return (
    <div className="search-input">
        <FaSearch className="icon"/>
        <input type="text" placeholder="Search"/>
    </div>
  )
}
