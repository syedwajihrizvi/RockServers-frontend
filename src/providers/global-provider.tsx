import { createContext, ReactNode, useContext, useEffect } from "react";
import { useUser } from "../hooks/useUser";

interface GlobalContextType {
    isLoggedIn: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children } : {children: ReactNode}) => {
    const { data: user, isLoading } = useUser()

    useEffect(() => {
        if (!isLoading && user)
            console.log("User data loaded successfully")
    }, [isLoading, user])

    const isLoggedIn = user && user?.email ? true : false
    return (
    <GlobalContext.Provider value={{isLoggedIn}}>
        {children}
    </GlobalContext.Provider>
    )

}

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext)
    if (!context)
        throw new Error("Context was not defined")
    return context
}

export default GlobalProvider