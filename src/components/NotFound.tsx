import { useEffect } from "react"
import { useLocation, useNavigate  } from "react-router-dom"
import useQueryStore from "../stores/useQueryStore"

export const NotFound = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { handleSetPost } = useQueryStore()
  useEffect(() => {
    const path = location.pathname
    if (path.match(new RegExp("post", "i")))
        handleSetPost("posts")
    else if (path.match(new RegExp("discuss", "i")))
        handleSetPost("discussions")
    navigate('/')


  })
  return (
    <h1>Not FOund</h1>
  )
}
