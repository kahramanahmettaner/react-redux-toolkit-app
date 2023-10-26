import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector"
import { getUserById } from "./usersSlice"
import { getAllPosts } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"

const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector( state => getUserById(state, Number(userId)))

    const postsForUser = useSelector(state => {
        const allPosts = getAllPosts(state)
        return allPosts.filter(post => post.userId === Number(userId))
    })

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
        </li>
    ))
    
    return (
        <section>
            <h2>{user?.name}</h2>
            <ol>{postTitles}</ol>
        </section>
    )
}

export default UserPage