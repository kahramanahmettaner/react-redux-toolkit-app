import { UseSelector, useSelector } from "react-redux/es/hooks/useSelector"
import { getUserById } from "./usersSlice"
import { getAllPosts, getPostsByUser } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"

const UserPage = () => {
    const { userId } = useParams()
    const user = useSelector( state => getUserById(state, Number(userId)))

    // use memoize selector for performance optimization
    const postsForUser = useSelector( state => getPostsByUser(state, Number(userId)))

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