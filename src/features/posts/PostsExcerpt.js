import PostAuthor from "./PostAuthor"
import TimeAgo from "./TimeAgo"
import ReactionButtons from "./ReactionButtons"
import { Link } from "react-router-dom"
import React from "react"

let PostsExcerpt = ({ post }) => {
  return (
    <article>
        <h2>{post.title}</h2>
        <p className="excerpt">{post.body.substring(0, 75)}...</p>
        <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
          <PostAuthor userId={post.userId} />
          <TimeAgo timestamp={post.date}/>
        </p>
        <ReactionButtons post={post} />
    </article>
  )
}

// This allows the component to not re-render if the prop that it receives has not changed
// otherwise, this component would be re-rendered every time, when any post is updated, even if it is not this one
PostsExcerpt = React.memo(PostsExcerpt)

export default PostsExcerpt