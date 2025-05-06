import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AccountSettings = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/account/login')
  })
  return (
    <div>AccountSettings</div>
  )
}
