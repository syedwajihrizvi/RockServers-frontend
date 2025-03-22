import { Filters } from "./Filters"
import { Navbar } from "./Navbar"
import { Posts } from "./Posts"
import { Sorters } from "./Sorters"

export const Main = () => {
  return (
    <div>
        <Navbar/>
        <div className="main-content">
            <div className="queries">
                <Filters/>
                <Sorters/>
            </div>
            <Posts/>
        </div>
    </div>
  )
}
