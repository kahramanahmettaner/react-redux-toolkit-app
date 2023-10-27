import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
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

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data 
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    try {
        const { id } = initialPost
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        return initialPost // only for jsonplaceholder so that the app works properly
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost
    const response = await axios.delete(`${POSTS_URL}/${id}`)
    if (response?.status === 200) return initialPost
    return `${response.status}: ${response?.statusText}`
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        /* we dont need this, because we use addNewPost async thunk now 
        postAdded: {
            reducer(state, action) { state.posts.push(action.payload) }, // state.posts.push normally would mutate the state. but it does only not hier inside the createSlice
            prepare(title, content, userId) { 
                return { payload: { id: nanoid(),
                                    title, 
                                    content, 
                                    date: new Date().toISOString(), 
                                    userId, 
                                    reactions: { thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0 } 
                                } 
                        } 
                }
        },
        */
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
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                })

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts) // concat: only inside createSlice
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload
                action.payload.date = new Date().toISOString()
                const posts = state.posts.filter(post => post.id !== id)
                state.posts = [...posts, action.payload]
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return
                }
                const { id } = action.payload
                const posts = state.posts.filter(post => post.id != id)
                state.posts = posts
            })
    }
})

// Selectors
export const getAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getPostById = (state, postId) => state.posts.posts.find( post => post.id === postId )
// Memoized selector for performance optimization (ensuring the output function is called only when the dependencies change, not at every dispatch)
export const getPostsByUser = createSelector(
    [getAllPosts, (state, userId) => userId],                       // Dependencies ( if the getAllPosts value or userId changes, then:)
    (posts, userId) => posts.filter(post => post.userId === userId)
)


// Actions
export const { postAdded, reactionAdded } = postsSlice.actions // when we add postAdded function in reducers, than crateSlice automatically generates an action creater function with the same name.

// Reducer
export default postsSlice.reducer