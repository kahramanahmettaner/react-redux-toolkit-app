import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns'
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
    posts: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { state.posts.push(action.payload) }, // state.posts.push normally would mutate the state. but it does only not hier inside the createSlice
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
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) existingPost.reactions[reaction]++ // works only in createSlice, would normally mutate the state
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => { // loading
                state.status = 'loading' 
            })
            .addCase(fetchPosts.rejected, (state, action) => { // failed
                state.status = 'failed' 
                state.error = action.error.message
            })
            .addCase(fetchPosts.fulfilled, (state, action) => { // succeeded
                state.status = 'succeeded' 
                // Adding date and reactions
                let min = 1
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        hooray: 0,
                        heart: 0,
                        rocket: 0,
                        eyes: 0
                    }
                    post.id = nanoid()
                    return post;
                })

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts) // concat: only inside createSlice
            })



    }
})

// Selectors
export const getAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

// Actions
export const { postAdded, reactionAdded } = postsSlice.actions // when we add postAdded function in reducers, than crateSlice automatically generates an action creater function with the same name.

// Reducer
export default postsSlice.reducer