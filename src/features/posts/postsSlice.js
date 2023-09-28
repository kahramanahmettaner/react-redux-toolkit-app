import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from 'date-fns'

const initialState = [
    {   id: '1', 
        title: 'Football', 
        content: 'Footbal is a sport and very popular', 
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    },
    {   id: '2', 
        title: 'Movies', 
        content: 'These movies are so good!', 
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        } 
    }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { state.push(action.payload) }, // state.push normally would mutate the state. but it does only not hier inside the createSlice
            prepare(title, content, userId) { 
                return { payload: { id: nanoid(),
                                    title, 
                                    content, 
                                    date: new Date().toISOString(), 
                                    userId, 
                                    reactions: { thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0} 
                                } 
                        } 
                }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.find(post => post.id === postId)
            if (existingPost) existingPost.reactions[reaction]++ // works only in createSlice, would normally mutate the state
        }
    }
})

// Selectors
export const getAllPosts = (state) => state.posts

// Actions
export const { postAdded, reactionAdded } = postsSlice.actions // when we add postAdded function in reducers, than crateSlice automatically generates an action creater function with the same name.

// Reducer
export default postsSlice.reducer