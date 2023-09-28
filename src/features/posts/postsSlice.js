import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
    { id: '1', title: 'Football', content: 'Footbal is a sport and very popular' },
    { id: '2', title: 'Movies', content: 'These movies are so good!' },
    { id: '3', title: 'IMDB', content: 'I like to check the ratings of the movies I watched on IMDB' },
    { id: '4', title: 'News are good?', content: 'What do you mean, if the news are good?' }
]

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) { state.push(action.payload) }, // state.push normally would mutate the state. but it does only not hier inside the createSlice
            prepare(title, content, userId) { 
                return { payload: { id: nanoid(), title, content, userId } 
            } }
        }    
    }
})

// Selectors
export const getAllPosts = (state) => state.posts

// Actions
export const { postAdded } = postsSlice.actions // when we add postAdded function in reducers, than crateSlice automatically generates an action creater function with the same name.

// Reducer
export default postsSlice.reducer