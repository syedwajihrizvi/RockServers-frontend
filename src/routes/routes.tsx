import { createBrowserRouter } from "react-router-dom";
import { Main } from "../components/Main";
import { PostDetails } from "../components/PostDetails";
import { AllPosts } from "../components/AllPosts";
import { DiscussionDetails } from "../components/DiscussionDetails";

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
    }
])

export default router