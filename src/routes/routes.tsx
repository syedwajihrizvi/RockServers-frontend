import { createBrowserRouter } from "react-router-dom";
import { Main } from "../components/Main";
import { PostDetails } from "../components/PostDetails";
import { AllPosts } from "../components/AllPosts";
import { DiscussionDetails } from "../components/DiscussionDetails";
import { Account } from "../components/Account";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { AccountSettings } from "../components/AccountSettings";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        children: [
            {
                path:'',
                element: <AllPosts/>
            },
            {
                path: 'posts/:id',
                element: <PostDetails/>
            },
            {
                path: 'discussions/:id',
                element: <DiscussionDetails/>
            }
        ]
    },
    {
        path: '/account',
        element: <Account/>,
        children: [
            {
                path: '',
                element: <AccountSettings/>
            },
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Register/>
            }
        ]
    }
])

export default router